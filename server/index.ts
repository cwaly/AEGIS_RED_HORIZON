import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { buildSystemInstruction, buildReportPrompt, withLanguageReminder } from './prompts.js';
import { geminiChat, isGeminiConfigured } from './providers/gemini.js';
import { ollamaChat, isOllamaOnline, getOllamaModelName } from './providers/ollama.js';
import { AuditReportSchema, InitRequestSchema, MessageRequestSchema, ReportRequestSchema } from './schemas.js';
import type { ChatMessage, ProviderId } from './schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// El servidor es intencionalmente sin estado: el navegador es la única fuente
// de verdad del historial de cada sesión (persistido en localStorage). Cada
// llamada envía el historial completo, evitando que un refresh de página o un
// reinicio del proceso (p.ej. `tsx watch`) desincronice contexto entre cliente
// y servidor.
async function runProvider(provider: ProviderId, systemInstruction: string, history: ChatMessage[], text: string): Promise<string> {
  return provider === 'gemini'
    ? geminiChat(systemInstruction, history, text)
    : ollamaChat(systemInstruction, history, text);
}

app.get('/api/health', async (_req, res) => {
  const ollamaOnline = await isOllamaOnline();
  res.json({
    gemini: isGeminiConfigured(),
    ollama: ollamaOnline,
    ollamaModel: getOllamaModelName(),
  });
});

app.post('/api/chat/init', async (req, res) => {
  const parsed = InitRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Petición inválida.' });
    return;
  }
  const { module: moduleId, provider, language } = parsed.data;
  const systemInstruction = buildSystemInstruction(moduleId, language);
  const initialPrompt = language === 'en'
    ? `Initializing module ${moduleId}. What is the target / CTF objective?`
    : `Inicializando módulo ${moduleId}. ¿Target u objetivo del CTF?`;

  try {
    const reply = await runProvider(provider, systemInstruction, [], initialPrompt);
    res.json({ reply });
  } catch (e) {
    res.status(502).json({ error: (e as Error).message });
  }
});

app.post('/api/chat/message', async (req, res) => {
  const parsed = MessageRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Petición inválida.' });
    return;
  }
  const { module: moduleId, provider, language, history, text } = parsed.data;
  const systemInstruction = buildSystemInstruction(moduleId, language);

  try {
    const reply = await runProvider(provider, systemInstruction, history, withLanguageReminder(text, language));
    res.json({ reply });
  } catch (e) {
    res.status(502).json({ error: (e as Error).message });
  }
});

app.post('/api/chat/report', async (req, res) => {
  const parsed = ReportRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Petición inválida.' });
    return;
  }
  const { module: moduleId, provider, language, history, auditorName } = parsed.data;
  const systemInstruction = buildSystemInstruction(moduleId, language);
  const basePrompt = buildReportPrompt(auditorName, language);

  const attempt = async (promptText: string) => {
    const raw = await runProvider(provider, systemInstruction, history, promptText);
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return AuditReportSchema.parse(JSON.parse(cleaned));
  };

  try {
    const report = await attempt(basePrompt);
    res.json({ report });
    return;
  } catch {
    // Reintento único con instrucción correctiva antes de rendirse.
  }

  try {
    const retryPrompt = `${basePrompt}\n\n[SYSTEM]: Tu respuesta anterior no era JSON válido según el esquema pedido. Responde ÚNICAMENTE con el JSON, sin texto adicional ni bloques markdown.`;
    const report = await attempt(retryPrompt);
    res.json({ report });
  } catch {
    res.status(422).json({ error: 'La IA no devolvió un reporte JSON válido tras reintentar.' });
  }
});

// Sirve el build de producción del frontend cuando existe (Docker / `npm start`).
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      next();
      return;
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Dev: el script `dev:server` fija PORT=4000 (gateway interno).
// Prod/Docker: puerto único que sirve estático + API. Orden de preferencia:
// PORT (compat. PaaS) -> AEGIS_PORT -> 1337 en producción, 4000 en dev.
const PORT =
  Number(process.env.PORT) ||
  Number(process.env.AEGIS_PORT) ||
  (process.env.NODE_ENV === 'production' ? 1337 : 4000);
app.listen(PORT, () => {
  console.log('\x1b[32m%s\x1b[0m', `✅ AEGIS CORE (AI Gateway) escuchando en puerto ${PORT}`);
  console.log(isGeminiConfigured() ? '   · Gemini 3.7 (Cloud): configurado' : '   · Gemini 3.7 (Cloud): SIN configurar (falta GEMINI_API_KEY en .env)');
  console.log(`   · Ollama (Local/Uncensored): modelo por defecto "${getOllamaModelName()}" — verifica con "ollama list"`);
});
