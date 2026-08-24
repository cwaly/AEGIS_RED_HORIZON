import { useEffect, useRef, useState, KeyboardEvent, ReactNode, FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, AIProviderId } from '../types';
import { Send, Terminal as TerminalIcon, Copy, Check, FileText, AlertTriangle, Trash2, Cloud, HardDrive, Columns2 } from 'lucide-react';

interface TerminalProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onGenerateReport: () => void;
  onClearSession: () => void;
  onEnterSplitView?: () => void;
  isLoading: boolean;
  activeModule: string;
  activeModuleName?: string;
  activeProvider: AIProviderId;
}

const CodeBlock = ({ children, className }: { children: ReactNode, className?: string }) => {
    const [copied, setCopied] = useState(false);
    const textInput = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(textInput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const match = /language-(\w+)/.exec(className || '');
    const isBlock = match || textInput.includes('\n') || textInput.length > 30;

    if (!isBlock) {
        return <code className="bg-gray-800 text-rose-300 px-1 rounded font-mono text-sm">{children}</code>;
    }

    return (
        <div className="relative group my-4 rounded-md overflow-hidden border border-gray-700 bg-[#0d1117]">
            <div className="flex justify-between items-center px-4 py-1 bg-gray-800 border-b border-gray-700 text-xs text-gray-400">
                <span>{match ? match[1] : 'bash'}</span>
                <button onClick={handleCopy} title="Copiar código" aria-label="Copiar código" className="flex items-center gap-1 hover:text-white">
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copied ? 'Copiado' : 'Copiar'}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed scrollbar-thin scrollbar-thumb-gray-600">
                <code>{children}</code>
            </pre>
        </div>
    );
};

export const Terminal: FC<TerminalProps> = ({ messages, onSendMessage, onGenerateReport, onClearSession, onEnterSplitView, isLoading, activeModule, activeModuleName, activeProvider }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const displayTitle = activeModuleName || activeModule.replace(/_/g, ' ');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] border-l border-gray-800 font-mono relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(244,63,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.1)_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-surface/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
            <TerminalIcon size={18} className="text-rose-500 animate-pulse" />
            <span className="text-sm font-bold text-gray-300">AEGIS // {displayTitle}</span>
            {activeProvider === 'gemini' ? (
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/40 px-2 py-0.5 rounded">
                <Cloud size={11} /> Cloud
              </span>
            ) : (
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-terminal bg-terminal/10 border border-terminal/40 px-2 py-0.5 rounded">
                <HardDrive size={11} /> Local
              </span>
            )}
        </div>
        <div className="flex items-center gap-2">
             {onEnterSplitView && (
               <button
                  onClick={onEnterSplitView}
                  className="flex items-center gap-2 text-xs bg-gray-800/50 hover:bg-terminal/20 text-gray-400 hover:text-terminal border border-gray-700 hover:border-terminal/50 px-3 py-1 rounded transition-colors"
                  title="Vista dividida: trabaja en varias terminales a la vez"
                  aria-label="Activar vista dividida"
               >
                  <Columns2 size={14} />
                  <span className="hidden md:inline">VISTA DIVIDIDA</span>
               </button>
             )}
             <button
                onClick={onClearSession}
                className="flex items-center gap-2 text-xs bg-gray-800/50 hover:bg-red-500/20 text-gray-400 hover:text-red-500 border border-gray-700 hover:border-red-500/50 px-3 py-1 rounded transition-colors"
                title="Limpiar terminal e iniciar nueva auditoría"
                aria-label="Limpiar terminal"
             >
                <Trash2 size={14} />
                <span className="hidden md:inline">LIMPIAR</span>
             </button>
             <button 
                onClick={onGenerateReport}
                className="flex items-center gap-2 text-xs bg-rose-500/20 hover:bg-rose-500/40 text-rose-500 border border-rose-500/50 px-3 py-1 rounded transition-colors"
                title="Generar Reporte de esta sesión"
                aria-label="Generar Reporte de esta sesión"
             >
                <FileText size={14} />
                <span className="hidden md:inline">REPORTE</span>
             </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 z-10 scroll-smooth">
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                <p className="text-xs tracking-widest uppercase mb-2">Secure Link Established</p>
                <p className="text-4xl font-bold text-gray-800 select-none">READY</p>
            </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[80%] rounded-lg p-4 ${
              msg.role === 'user' 
                ? 'bg-rose-500/10 border border-rose-500/30 text-gray-200' 
                : 'bg-surface border border-gray-800 text-gray-300 shadow-lg'
            }`}>
              <div className="flex items-center gap-2 mb-2 text-xs opacity-50 uppercase tracking-wider">
                <span className={msg.role === 'user' ? 'text-rose-500' : 'text-slate-400'}>
                    {msg.role === 'user' ? 'OPERATOR' : 'AEGIS_AI'}
                </span>
                <span>{msg.timestamp.toLocaleTimeString()}</span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown components={{ code: CodeBlock as any }}>
                    {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-gray-800 rounded-lg p-4 flex items-center gap-2 text-rose-500">
              <span className="animate-pulse">_</span>
              <span className="text-sm text-gray-400">Procesando inteligencia táctica...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-yellow-900/20 border-t border-yellow-900/50 px-4 py-1 text-[10px] text-yellow-500 flex items-center justify-center gap-2">
        <AlertTriangle size={10} />
        <span>EXECUTION MODE: Copy commands above -{'>'} Run in Kali Terminal -{'>'} Paste output below</span>
      </div>

      <div className="p-4 bg-surface/80 border-t border-gray-800 backdrop-blur z-20">
        <div className="relative flex items-center">
            <span className="absolute left-3 text-rose-500 font-bold">{'>'}</span>
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pegue aquí el output de su terminal o introduzca un comando..."
            className="w-full bg-[#0a0a0c] border border-gray-700 rounded-md py-3 pl-8 pr-12 text-gray-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono shadow-inner"
            autoFocus
            />
            <button 
                onClick={handleSend}
                disabled={isLoading}
                title="Enviar comando" 
                aria-label="Enviar comando"
                className="absolute right-2 p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
            >
            <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};