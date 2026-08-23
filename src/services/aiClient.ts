import { ModuleType, Language, AuditReport, AIProviderId, Message } from '../types';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Error de red (${res.status})`);
  }
  return data as T;
}

// El historial "system" es solo ruido de UI (notificaciones locales); nunca
// formó parte del intercambio real con el modelo.
export const toChatHistory = (messages: Message[]): ChatMessage[] =>
  messages
    .filter((m): m is Message & { role: 'user' | 'model' } => m.role === 'user' || m.role === 'model')
    .map((m) => ({ role: m.role, text: m.content }));

export const initializeChat = async (module: ModuleType, provider: AIProviderId, language: Language): Promise<string> => {
  const { reply } = await postJSON<{ reply: string }>('/api/chat/init', { module, provider, language });
  return reply;
};

export const sendMessage = async (
  module: ModuleType,
  provider: AIProviderId,
  language: Language,
  history: ChatMessage[],
  text: string,
): Promise<string> => {
  try {
    const { reply } = await postJSON<{ reply: string }>('/api/chat/message', { module, provider, language, history, text });
    return reply;
  } catch (error) {
    console.error('AEGIS AI Gateway Error:', error);
    return `Error: Enlace neuronal cortado. ${(error as Error).message || 'Verifica el motor de IA seleccionado en OPSEC & SYSTEM.'}`;
  }
};

export const generateReportData = async (
  module: ModuleType,
  provider: AIProviderId,
  language: Language,
  history: ChatMessage[],
  auditorName: string,
): Promise<AuditReport | null> => {
  try {
    const { report } = await postJSON<{ report: AuditReport }>('/api/chat/report', { module, provider, language, history, auditorName });
    return report;
  } catch (e) {
    console.error('Failed to generate report', e);
    return null;
  }
};

export interface HealthStatus {
  gemini: boolean;
  ollama: boolean;
  ollamaModel: string;
}

export const fetchHealth = async (): Promise<HealthStatus | null> => {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return null;
  }
};
