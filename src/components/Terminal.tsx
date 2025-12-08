import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Send, Terminal as TerminalIcon, Copy, Check, FileText } from 'lucide-react';

interface TerminalProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onGenerateReport: () => void;
  isLoading: boolean;
  activeModule: string;
}

const CodeBlock = ({ children, className }: { children: any, className?: string }) => {
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
                <button onClick={handleCopy} className="flex items-center gap-1 hover:text-white">
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

export const Terminal: React.FC<TerminalProps> = ({ messages, onSendMessage, onGenerateReport, isLoading, activeModule }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] border-l border-gray-800 font-mono relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-surface/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
            <TerminalIcon size={18} className="text-primary animate-pulse" />
            <span className="text-sm font-bold text-gray-300">AURA_OPS // {activeModule}</span>
        </div>
        <div className="flex items-center gap-4">
             <button 
                onClick={onGenerateReport}
                className="flex items-center gap-2 text-xs bg-secondary/20 hover:bg-secondary/40 text-secondary border border-secondary/50 px-3 py-1 rounded transition-colors"
                title="Generar Reporte de esta sesión"
             >
                <FileText size={14} />
                <span>GENERAR REPORTE</span>
             </button>
            <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500"></span>
            </div>
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
                ? 'bg-primary/10 border border-primary/30 text-gray-200' 
                : 'bg-surface border border-gray-800 text-gray-300 shadow-lg'
            }`}>
              <div className="flex items-center gap-2 mb-2 text-xs opacity-50 uppercase tracking-wider">
                <span className={msg.role === 'user' ? 'text-primary' : 'text-secondary'}>
                    {msg.role === 'user' ? 'OPERATOR' : 'AURA_AI'}
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
            <div className="bg-surface border border-gray-800 rounded-lg p-4 flex items-center gap-2 text-primary">
              <span className="animate-pulse">_</span>
              <span className="text-sm text-gray-400">Procesando inteligencia...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-surface/80 border-t border-gray-800 backdrop-blur z-20">
        <div className="relative flex items-center">
            <span className="absolute left-3 text-primary font-bold">{'>'}</span>
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ingrese comando, objetivo o pregunta..."
            className="w-full bg-[#0a0a0c] border border-gray-700 rounded-md py-3 pl-8 pr-12 text-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono shadow-inner"
            autoFocus
            />
            <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
            >
            <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};