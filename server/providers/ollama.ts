import type { ChatMessage } from '../schemas.js';

function baseUrl(): string {
  return process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
}

function modelName(): string {
  // Dolphin 3.0 (8B): modelo "sin censura" de la librería oficial de Ollama,
  // probado establemente en hardware de 12GB VRAM (responde rápido, no se
  // cuelga, no rechaza tareas de pentesting autorizado). A diferencia de
  // WhiteRabbitNeo (quantizaciones comunitarias que probamos y se colgaban
  // por falta de stop-token en su Modelfile), este sí es confiable.
  // Configurable vía OLLAMA_MODEL en .env.
  return process.env.OLLAMA_MODEL || 'dolphin3';
}

interface OllamaChatResponse {
  message?: { content?: string };
}

export async function ollamaChat(systemInstruction: string, history: ChatMessage[], userText: string): Promise<string> {
  const messages = [
    { role: 'system', content: systemInstruction },
    ...history.map((m) => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text })),
    { role: 'user', content: userText },
  ];

  let res: Response;
  try {
    res = await fetch(`${baseUrl()}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName(),
        messages,
        stream: false,
        // num_predict acota la respuesta: algunas quantizaciones GGUF de la
        // comunidad (p.ej. WhiteRabbitNeo) no traen un stop-token configurado
        // en su Modelfile y pueden generar sin parar hasta el límite de contexto.
        options: { temperature: 0.1, num_predict: 2048 },
      }),
    });
  } catch {
    throw new Error(`No se pudo contactar a Ollama en ${baseUrl()}. ¿Está corriendo? (ollama serve)`);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Ollama respondió ${res.status}. ¿Descargaste el modelo "${modelName()}"? (ollama pull ${modelName()}) ${body}`);
  }

  const data = (await res.json()) as OllamaChatResponse;
  return data.message?.content || 'Error: Sin respuesta del motor local (Ollama).';
}

export async function isOllamaOnline(): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl()}/api/tags`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

export function getOllamaModelName(): string {
  return modelName();
}
