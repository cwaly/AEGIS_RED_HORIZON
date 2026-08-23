import { z } from 'zod';

export const AuditFindingSchema = z.object({
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
  title: z.string(),
  description: z.string(),
  remediation: z.string(),
});

export const AuditReportSchema = z.object({
  title: z.string(),
  target: z.string(),
  date: z.string(),
  auditor: z.string(),
  executiveSummary: z.string(),
  findings: z.array(AuditFindingSchema),
  conclusion: z.string(),
});

export type AuditReport = z.infer<typeof AuditReportSchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ProviderIdSchema = z.enum(['gemini', 'ollama']);
export type ProviderId = z.infer<typeof ProviderIdSchema>;

export const LanguageSchema = z.enum(['es', 'en']);
export type Language = z.infer<typeof LanguageSchema>;

export const InitRequestSchema = z.object({
  module: z.string().min(1),
  provider: ProviderIdSchema,
  language: LanguageSchema,
});

export const MessageRequestSchema = z.object({
  module: z.string().min(1),
  provider: ProviderIdSchema,
  language: LanguageSchema,
  history: z.array(ChatMessageSchema).default([]),
  text: z.string().min(1),
});

export const ReportRequestSchema = z.object({
  module: z.string().min(1),
  provider: ProviderIdSchema,
  language: LanguageSchema,
  history: z.array(ChatMessageSchema).default([]),
  auditorName: z.string().min(1),
});
