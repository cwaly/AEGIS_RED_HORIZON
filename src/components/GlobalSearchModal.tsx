import { FC, useMemo, useState } from 'react';
import { Engagement, Message, ModuleType, Tool } from '../types';
import { Search, X, Briefcase, Terminal as TerminalIcon } from 'lucide-react';

interface GlobalSearchModalProps {
  sessionsData: Record<string, Message[]>;
  engagements: Engagement[];
  toolsConfig: Tool[];
  onOpenResult: (engagementId: string, module: ModuleType) => void;
  onClose: () => void;
}

interface SearchResult {
  key: string;
  engagementId: string;
  engagementName: string;
  module: ModuleType;
  moduleName: string;
  message: Message;
  snippet: string;
}

const SNIPPET_RADIUS = 50;

const buildSnippet = (content: string, query: string): string => {
  const idx = content.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return content.slice(0, SNIPPET_RADIUS * 2);
  const start = Math.max(0, idx - SNIPPET_RADIUS);
  const end = Math.min(content.length, idx + query.length + SNIPPET_RADIUS);
  return (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '');
};

const Highlighted: FC<{ snippet: string; query: string }> = ({ snippet, query }) => {
  const idx = snippet.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{snippet}</>;
  return (
    <>
      {snippet.slice(0, idx)}
      <mark className="bg-rose-500/40 text-white rounded px-0.5">{snippet.slice(idx, idx + query.length)}</mark>
      {snippet.slice(idx + query.length)}
    </>
  );
};

export const GlobalSearchModal: FC<GlobalSearchModalProps> = ({ sessionsData, engagements, toolsConfig, onOpenResult, onClose }) => {
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    const qLower = q.toLowerCase();
    const out: SearchResult[] = [];
    Object.entries(sessionsData).forEach(([key, msgs]) => {
      const sepIdx = key.indexOf('::');
      if (sepIdx === -1) return;
      const engagementId = key.slice(0, sepIdx);
      const module = key.slice(sepIdx + 2) as ModuleType;
      const eng = engagements.find(e => e.id === engagementId);
      const tool = toolsConfig.find(t => t.id === module);
      msgs.forEach(msg => {
        if (msg.content.toLowerCase().includes(qLower)) {
          out.push({
            key: `${key}:${msg.id}`,
            engagementId,
            engagementName: eng?.name || 'Engagement eliminado',
            module,
            moduleName: tool?.name || module,
            message: msg,
            snippet: buildSnippet(msg.content, q),
          });
        }
      });
    });
    out.sort((a, b) => b.message.timestamp.getTime() - a.message.timestamp.getTime());
    return out.slice(0, 50);
  }, [query, sessionsData, engagements, toolsConfig]);

  return (
    <div className="fixed inset-0 z-[65] bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-[10vh]">
      <div className="bg-surface border border-gray-700 rounded-lg w-full max-w-2xl shadow-2xl relative max-h-[75vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center gap-3 shrink-0">
          <Search size={18} className="text-rose-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en todas las sesiones y engagements (CVE, IP, texto)..."
            title="Búsqueda global"
            className="flex-1 bg-transparent text-white text-sm focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} title="Cerrar búsqueda" aria-label="Cerrar búsqueda" className="text-gray-400 hover:text-white transition-colors shrink-0"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {query.trim().length < 2 && (
            <p className="text-xs text-gray-600 text-center py-10">Escribe al menos 2 caracteres para buscar.</p>
          )}
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="text-xs text-gray-600 text-center py-10">Sin resultados para "{query}".</p>
          )}
          {results.map((r) => (
            <button
              key={r.key}
              onClick={() => onOpenResult(r.engagementId, r.module)}
              className="w-full text-left px-4 py-3 border-b border-gray-800/70 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5 text-[10px] uppercase tracking-wider">
                <span className="flex items-center gap-1 text-gray-500"><Briefcase size={10} /> {r.engagementName}</span>
                <span className="text-gray-700">·</span>
                <span className="flex items-center gap-1 text-rose-400"><TerminalIcon size={10} /> {r.moduleName}</span>
                <span className="text-gray-700">·</span>
                <span className="text-gray-600">{r.message.role === 'user' ? 'OPERATOR' : 'AEGIS_AI'}</span>
                <span className="text-gray-700 ml-auto normal-case">{r.message.timestamp.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-300 font-mono leading-relaxed">
                <Highlighted snippet={r.snippet} query={query.trim()} />
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
