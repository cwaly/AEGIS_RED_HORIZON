import { GoogleGenAI } from '@google/genai';
import type { ChatMessage } from '../schemas.js';

let client: GoogleGenAI | null = null;

function resolveApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
}

function getClient(): GoogleGenAI {
  if (client) return client;
  const apiKey = resolveApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no configurada en el servidor (.env)');
  }
  client = new GoogleGenAI({ apiKey });
  return client;
}

export function isGeminiConfigured(): boolean {
  return !!resolveApiKey();
}

export async function geminiChat(systemInstruction: string, history: ChatMessage[], userText: string): Promise<string> {
  const ai = getClient();

  const contents = [
    ...history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    { role: 'user', parts: [{ text: userText }] },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      systemInstruction,
      temperature: 0.1,
    },
  });

  return response.text || 'Error: Sin respuesta del núcleo Gemini.';
}
