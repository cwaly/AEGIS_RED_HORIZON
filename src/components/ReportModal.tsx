import { FC, useState, ClipboardEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AuditReport, EvidenceImage } from '../types';
import { X, FileText, Download, Printer, Paperclip } from 'lucide-react';

interface ReportModalProps {
  report: AuditReport;
  onClose: () => void;
}

export const ReportModal: FC<ReportModalProps> = ({ report, onClose }) => {
  const [evidenceByFinding, setEvidenceByFinding] = useState<Record<number, EvidenceImage[]>>({});

  const addEvidenceFiles = (findingIndex: number, fileList: FileList | File[] | null) => {
    if (!fileList) return;
    Array.from(fileList).filter(f => f.type.startsWith('image/')).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setEvidenceByFinding(prev => ({
          ...prev,
          [findingIndex]: [...(prev[findingIndex] || []), { id: uuidv4(), dataUrl, caption: '' }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePaste = (findingIndex: number, e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length) {
      e.preventDefault();
      addEvidenceFiles(findingIndex, files);
    }
  };

  const removeEvidence = (findingIndex: number, evidenceId: string) => {
    setEvidenceByFinding(prev => ({
      ...prev,
      [findingIndex]: (prev[findingIndex] || []).filter(ev => ev.id !== evidenceId)
    }));
  };

  const updateCaption = (findingIndex: number, evidenceId: string, caption: string) => {
    setEvidenceByFinding(prev => ({
      ...prev,
      [findingIndex]: (prev[findingIndex] || []).map(ev => ev.id === evidenceId ? { ...ev, caption } : ev)
    }));
  };


  const generateHTML = () => {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>${report.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        body { font-family: 'Inter', sans-serif; color: #1a1a1a; margin: 0; padding: 0; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #e11d48 100%); color: white; padding: 40px; text-align: center; }
        .logo-text { font-size: 24px; font-weight: bold; letter-spacing: 4px; margin-bottom: 10px; }
        .report-title { font-size: 32px; font-weight: bold; margin: 0; }
        .meta { display: flex; justify-content: space-between; padding: 20px 40px; background: #f3f4f6; border-bottom: 1px solid #e5e7eb; }
        .content { padding: 40px; max-width: 900px; margin: 0 auto; }
        h1, h2, h3 { color: #0f172a; }
        h2 { border-bottom: 2px solid #e11d48; padding-bottom: 10px; margin-top: 40px; }
        .summary { background: #fff1f2; border-left: 5px solid #e11d48; padding: 20px; border-radius: 4px; }
        .finding { margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .finding-header { padding: 15px; display: flex; justify-content: space-between; align-items: center; color: white; }
        .CRITICAL { background-color: #7f1d1d; }
        .HIGH { background-color: #b91c1c; }
        .MEDIUM { background-color: #d97706; }
        .LOW { background-color: #059669; }
        .INFO { background-color: #3b82f6; }
        .finding-body { padding: 20px; background: white; }
        .remediation { margin-top: 15px; background: #f9fafb; padding: 15px; border-top: 1px solid #e5e7eb; }
        .evidence { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px; }
        .evidence figure { margin: 0; max-width: 280px; }
        .evidence img { width: 100%; border-radius: 4px; border: 1px solid #e5e7eb; display: block; }
        .evidence figcaption { font-size: 11px; color: #6b7280; margin-top: 4px; text-align: center; }
        .footer { text-align: center; margin-top: 50px; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        @media print {
            .no-print { display: none; }
            body { font-size: 12pt; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-text">AEGIS // RED HORIZON</div>
        <div class="report-title">${report.title}</div>
    </div>
    <div class="meta">
        <div><strong>Target:</strong> ${report.target}</div>
        <div><strong>Date:</strong> ${report.date}</div>
        <div><strong>Auditor:</strong> ${report.auditor} (Senior Lead)</div>
    </div>
    <div class="content">
        <h2>Executive Summary</h2>
        <div class="summary">${report.executiveSummary}</div>
        <h2>Technical Findings</h2>
        ${report.findings.map((f, i) => `
            <div class="finding">
                <div class="finding-header ${f.severity}">
                    <strong>[${f.severity}] ${f.title}</strong>
                </div>
                <div class="finding-body">
                    <p>${f.description}</p>
                    <div class="remediation"><strong>Remediation:</strong><br/>${f.remediation}</div>
                    ${(evidenceByFinding[i] || []).length ? `
                    <div class="evidence">
                        ${(evidenceByFinding[i] || []).map(ev => `
                            <figure>
                                <img src="${ev.dataUrl}" alt="Evidencia" />
                                ${ev.caption ? `<figcaption>${ev.caption}</figcaption>` : ''}
                            </figure>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `).join('')}
        <h2>Conclusion</h2>
        <p>${report.conclusion}</p>
    </div>
    <div class="footer">Generated by AEGIS Intelligence Core. Confidential Document.</div>
</body>
</html>
    `;
  };

  const handleDownloadHTML = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEGIS_REPORT_${report.title.replace(/\s+/g, '_')}.html`;
    a.click();
  };

  const handleDownloadWord = () => {
    const html = generateHTML();
    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Report</title></head><body>${html}</body></html>
    `;
    const blob = new Blob(['\ufeff', wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEGIS_REPORT_${report.title.replace(/\s+/g, '_')}.doc`;
    a.click();
  };

  const handlePrintPDF = () => {
     const printWindow = window.open('', '_blank');
     if (printWindow) {
         printWindow.document.write(generateHTML());
         printWindow.document.close();
         printWindow.focus();
         setTimeout(() => {
             printWindow.print();
             printWindow.close();
         }, 500);
     }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        <div className="bg-gradient-to-r from-slate-800 to-rose-600 p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
                <FileText size={24} />
                <div>
                    <h2 className="text-xl font-bold">{report.title}</h2>
                    <p className="text-xs opacity-80">Ready for Export</p>
                </div>
            </div>
            <button onClick={onClose} title="Cerrar reporte" aria-label="Cerrar reporte" className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={24} />
            </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
            <div className="bg-white shadow-lg p-10 max-w-2xl mx-auto min-h-[60vh] border border-gray-200 transform scale-95 origin-top">
                <div className="border-b-4 border-rose-600 pb-4 mb-6 flex justify-between items-end">
                    <h1 className="text-3xl font-bold text-gray-800">AUDIT REPORT</h1>
                    <span className="text-rose-600 font-mono text-sm">CONFIDENTIAL</span>
                </div>
                <h2 className="text-xl font-bold text-gray-700 mb-2">{report.title}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-8 bg-gray-50 p-4 rounded">
                    <div>TARGET: {report.target}</div>
                    <div>DATE: {report.date}</div>
                    <div>AUDITOR: {report.auditor}</div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 border-b border-gray-200 mb-4">FINDINGS ({report.findings.length})</h3>
                    {report.findings.map((f, i) => (
                        <div key={i} className={`mb-4 border-l-4 pl-4 py-1 ${f.severity === 'CRITICAL' ? 'border-[#991b1b]' : 'border-[#e11d48]'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-700 text-sm">{f.title}</span>
                                <span className={`text-[10px] text-white px-2 py-0.5 rounded ${f.severity === 'CRITICAL' ? 'bg-[#991b1b]' : 'bg-[#e11d48]'}`}>{f.severity}</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{f.description}</p>
                            <div className="flex items-start gap-2 flex-wrap mt-2" tabIndex={0} onPaste={(e) => handlePaste(i, e)}>
                                {(evidenceByFinding[i] || []).map(ev => (
                                    <div key={ev.id} className="w-20">
                                        <div className="relative group">
                                            <img src={ev.dataUrl} alt="Evidencia" className="w-20 h-20 object-cover rounded border border-gray-300" />
                                            <button
                                                onClick={() => removeEvidence(i, ev.id)}
                                                title="Quitar evidencia"
                                                aria-label="Quitar evidencia"
                                                className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={ev.caption}
                                            onChange={(e) => updateCaption(i, ev.id, e.target.value)}
                                            placeholder="Descripción..."
                                            title="Descripción de la captura"
                                            className="w-full text-[9px] text-gray-500 border-b border-gray-200 focus:border-rose-400 focus:outline-none mt-1 bg-transparent"
                                        />
                                    </div>
                                ))}
                                <label
                                    htmlFor={`evidence-input-${i}`}
                                    title="Pega una captura con Ctrl+V o haz clic para adjuntar un archivo"
                                    className="w-20 h-20 flex flex-col items-center justify-center gap-1 text-[9px] text-gray-400 hover:text-rose-600 border border-dashed border-gray-300 hover:border-rose-400 rounded cursor-pointer transition-colors text-center px-1"
                                >
                                    <Paperclip size={14} />
                                    Adjuntar / Pegar
                                </label>
                                <input
                                    id={`evidence-input-${i}`}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => { addEvidenceFiles(i, e.target.files); e.target.value = ''; }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
            <button onClick={handlePrintPDF} className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-bold"><Printer size={18} /> PDF</button>
            <button onClick={handleDownloadWord} className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg font-bold"><FileText size={18} /> Word</button>
            <button onClick={handleDownloadHTML} className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg font-bold shadow-lg shadow-rose-500/20"><Download size={18} /> HTML</button>
        </div>
      </div>
    </div>
  );
};