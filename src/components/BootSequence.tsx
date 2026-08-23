import { FC, useEffect, useState } from 'react';

const BOOT_LINES = [
  'INITIALIZING AEGIS CORE...',
  'LOADING OPSEC MODULES...',
  'ESTABLISHING SECURE UPLINK...',
  'VERIFYING NEURAL LINK (GEMINI / OLLAMA)...',
  'ACCESS GRANTED.',
];

interface BootSequenceProps {
  onDone: () => void;
}

export const BootSequence: FC<BootSequenceProps> = ({ onDone }) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    if (visibleLines.length >= BOOT_LINES.length) {
      const finish = setTimeout(onDone, 450);
      return () => clearTimeout(finish);
    }
    const delay = visibleLines.length === 0 ? 200 : 300;
    const t = setTimeout(() => {
      setVisibleLines((prev) => [...prev, BOOT_LINES[prev.length]]);
    }, delay);
    return () => clearTimeout(t);
  }, [visibleLines, onDone]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') onDone();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onDone]);

  return (
    <div className="h-screen w-full bg-[#0a0a0c] flex items-center justify-center relative overflow-hidden font-mono">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#f43f5e_0%,transparent_50%)]"></div>
      <div className="z-10 w-full max-w-lg px-8">
        <div className="space-y-2 text-sm min-h-[160px]">
          {visibleLines.map((line, i) => (
            <div key={line} className="flex items-center gap-2 text-terminal">
              <span className="text-rose-500">{'>'}</span>
              <span>{line}</span>
              {i === visibleLines.length - 1 && visibleLines.length < BOOT_LINES.length && (
                <span className="animate-blink">_</span>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onDone}
          className="mt-6 text-[10px] uppercase tracking-widest text-gray-600 hover:text-gray-400 transition-colors"
        >
          Skip [Enter]
        </button>
      </div>
    </div>
  );
};
