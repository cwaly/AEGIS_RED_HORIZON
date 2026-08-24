import { FC } from 'react';
import { ModuleType, Tool, Message, AIProviderId, ModuleCategory } from '../types';
import { Terminal } from './Terminal';
import { sessionKey } from '../utils/sessionKey';
import { Plus, X, Columns2 } from 'lucide-react';

interface SplitTerminalViewProps {
  paneModules: ModuleType[];
  toolsConfig: Tool[];
  sessionsData: Record<string, Message[]>;
  loadingKeys: Record<string, boolean>;
  activeEngagementId: string;
  activeProvider: AIProviderId;
  onChangePaneModule: (index: number, module: ModuleType) => void;
  onSendMessage: (module: ModuleType, text: string) => void;
  onGenerateReport: (module: ModuleType) => void;
  onClearSession: (module: ModuleType) => void;
  onAddPane: () => void;
  onRemovePane: (index: number) => void;
  onExit: () => void;
}

export const SplitTerminalView: FC<SplitTerminalViewProps> = ({
  paneModules, toolsConfig, sessionsData, loadingKeys, activeEngagementId, activeProvider,
  onChangePaneModule, onSendMessage, onGenerateReport, onClearSession, onAddPane, onRemovePane, onExit,
}) => {
  const gridColsClass = paneModules.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2';

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-surface/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terminal">
          <Columns2 size={14} />
          <span>Vista Dividida · {paneModules.length} paneles</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddPane}
            disabled={paneModules.length >= 3}
            title="Agregar un tercer panel"
            aria-label="Agregar panel"
            className="flex items-center gap-1.5 text-xs bg-gray-800/50 hover:bg-terminal/20 text-gray-400 hover:text-terminal border border-gray-700 hover:border-terminal/50 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1 rounded transition-colors"
          >
            <Plus size={13} /> AGREGAR PANEL
          </button>
          <button
            onClick={onExit}
            title="Salir de vista dividida y volver a pantalla normal"
            aria-label="Salir de vista dividida"
            className="flex items-center gap-1.5 text-xs bg-gray-800/50 hover:bg-red-500/20 text-gray-400 hover:text-red-500 border border-gray-700 hover:border-red-500/50 px-3 py-1 rounded transition-colors"
          >
            <X size={13} /> SALIR
          </button>
        </div>
      </div>

      <div className={`flex-1 grid grid-cols-1 ${gridColsClass} gap-px bg-gray-800 overflow-hidden`}>
        {paneModules.map((mod, i) => {
          const key = sessionKey(activeEngagementId, mod);
          const messages = sessionsData[key] || [];
          const isLoading = !!loadingKeys[key];
          const toolObj = toolsConfig.find(t => t.id === mod);
          const toolName = toolObj ? toolObj.name.toUpperCase() : mod;

          return (
            <div key={i} className="flex flex-col h-full min-h-0 bg-[#0a0a0c] overflow-hidden">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-black/40 border-b border-gray-800 shrink-0">
                <select
                  value={mod}
                  onChange={(e) => onChangePaneModule(i, e.target.value as ModuleType)}
                  title="Cambiar el módulo mostrado en este panel"
                  aria-label="Cambiar módulo del panel"
                  className="flex-1 bg-black/50 border border-gray-700 text-gray-300 text-[11px] px-2 py-1 rounded focus:border-terminal focus:outline-none"
                >
                  {Object.values(ModuleCategory).map((cat) => (
                    <optgroup key={cat} label={cat}>
                      {toolsConfig.filter(t => t.category === cat).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {paneModules.length > 2 && (
                  <button
                    onClick={() => onRemovePane(i)}
                    title="Cerrar este panel"
                    aria-label="Cerrar este panel"
                    className="text-gray-500 hover:text-red-500 transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="flex-1 min-h-0">
                <Terminal
                  messages={messages}
                  isLoading={isLoading}
                  activeModule={mod}
                  activeModuleName={toolName}
                  activeProvider={activeProvider}
                  onSendMessage={(text) => onSendMessage(mod, text)}
                  onGenerateReport={() => onGenerateReport(mod)}
                  onClearSession={() => onClearSession(mod)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
