import { FC, useState } from 'react';
import { BoardFinding, FindingStatus, Severity } from '../types';
import { ArrowLeft, ArrowRight, Trash2, Plus, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface FindingsBoardProps {
  findings: BoardFinding[];
  onAdd: (title: string, severity: Severity) => void;
  onMove: (id: string, status: FindingStatus) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<BoardFinding, 'description' | 'remediation'>>) => void;
  onGenerateReport: () => void;
}

const SEVERITY_COLOR: Record<Severity, string> = {
  CRITICAL: '#991b1b',
  HIGH: '#e11d48',
  MEDIUM: '#d97706',
  LOW: '#059669',
  INFO: '#3b82f6',
};

const COLUMNS: { status: FindingStatus; label: string }[] = [
  { status: 'found', label: 'Encontrado' },
  { status: 'verifying', label: 'Verificando' },
  { status: 'reported', label: 'Reportado' },
];

export const FindingsBoard: FC<FindingsBoardProps> = ({ findings, onAdd, onMove, onDelete, onUpdate, onGenerateReport }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState<Severity>('MEDIUM');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const title = newTitle.trim();
    if (!title) return;
    onAdd(title, newSeverity);
    setNewTitle('');
  };

  const reportedCount = findings.filter(f => f.status === 'reported').length;

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Tablero de Hallazgos</h2>
            <p className="text-gray-400">Sigue el estado de cada hallazgo del engagement activo, de descubierto a reportado.</p>
          </div>
          <button
            onClick={onGenerateReport}
            title="Genera un reporte a partir de los hallazgos en la columna Reportado, sin volver a consultar a la IA"
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-rose-500/20 shrink-0"
          >
            <FileText size={16} /> Generar Reporte ({reportedCount})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8 bg-surface border border-gray-800 rounded-lg p-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="Título del hallazgo (ej: SQLi en /login vía parámetro user)..."
            title="Título del nuevo hallazgo"
            className="flex-1 min-w-[240px] bg-black/50 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg focus:border-rose-500 focus:outline-none"
          />
          <select
            value={newSeverity}
            onChange={(e) => setNewSeverity(e.target.value as Severity)}
            title="Severidad del nuevo hallazgo"
            aria-label="Severidad del nuevo hallazgo"
            className="bg-black/50 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg focus:border-rose-500 focus:outline-none"
          >
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
            <option value="INFO">INFO</option>
          </select>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-sm transition-colors"
          >
            <Plus size={16} /> Agregar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col, colIdx) => (
            <div key={col.status} className="bg-[#0f0f13] border border-gray-800 rounded-lg p-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
                {col.label}
                <span className="text-[10px] font-mono text-gray-600 bg-black/30 px-2 py-0.5 rounded-sm">
                  {findings.filter(f => f.status === col.status).length}
                </span>
              </h3>
              <div className="space-y-2 min-h-[120px]">
                {findings.filter(f => f.status === col.status).map(f => {
                  const isExpanded = expandedId === f.id;
                  return (
                    <div key={f.id} className="bg-surface border border-gray-800 border-l-4 rounded-sm p-3" style={{ borderLeftColor: SEVERITY_COLOR[f.severity] }}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: SEVERITY_COLOR[f.severity] }}>{f.severity}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : f.id)}
                            title={isExpanded ? 'Ocultar descripción y remediación' : 'Agregar descripción y remediación'}
                            aria-label={isExpanded ? 'Ocultar detalle' : 'Editar detalle'}
                            className="text-gray-600 hover:text-white transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                          <button onClick={() => onDelete(f.id)} title="Eliminar hallazgo" aria-label="Eliminar hallazgo" className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 mb-2 break-words">{f.title}</p>

                      {isExpanded && (
                        <div className="space-y-2 mb-2">
                          <div>
                            <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1 block">Descripción técnica</label>
                            <textarea
                              value={f.description || ''}
                              onChange={(e) => onUpdate(f.id, { description: e.target.value })}
                              placeholder="Qué encontraste y cómo se reproduce..."
                              rows={2}
                              className="w-full bg-black/50 border border-gray-700 text-gray-300 text-[11px] p-2 rounded focus:border-rose-500 focus:outline-none resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1 block">Remediación</label>
                            <textarea
                              value={f.remediation || ''}
                              onChange={(e) => onUpdate(f.id, { remediation: e.target.value })}
                              placeholder="Cómo corregirlo..."
                              rows={2}
                              className="w-full bg-black/50 border border-gray-700 text-gray-300 text-[11px] p-2 rounded focus:border-rose-500 focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => onMove(f.id, COLUMNS[colIdx - 1].status)}
                          disabled={colIdx === 0}
                          title="Mover a la columna anterior"
                          aria-label="Mover a la columna anterior"
                          className="text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowLeft size={14} />
                        </button>
                        <button
                          onClick={() => onMove(f.id, COLUMNS[colIdx + 1].status)}
                          disabled={colIdx === COLUMNS.length - 1}
                          title="Mover a la columna siguiente"
                          aria-label="Mover a la columna siguiente"
                          className="text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {findings.filter(f => f.status === col.status).length === 0 && (
                  <p className="text-[11px] text-gray-600 text-center py-6">Sin hallazgos aquí.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
