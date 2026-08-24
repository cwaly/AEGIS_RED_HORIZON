import { useState, useEffect, FC, FormEvent } from 'react';
import { ModuleType, Message, Tool, ModuleCategory, UserProfile, AuditReport, AIProviderId, Language, Engagement } from './types';
import { initializeChat, sendMessage, generateReportData, toChatHistory, fetchHealth, HealthStatus } from './services/aiClient';
import { Terminal } from './components/Terminal';
import { Logo } from './components/Logo';
import { ReportModal } from './components/ReportModal';
import { TacticalOverlay } from './components/TacticalOverlay';
import { BootSequence } from './components/BootSequence';
import { LinksPanel } from './components/LinksPanel';
import {
  Terminal as TerminalIcon, Settings, FileText, Menu, X, ChevronDown,
  ChevronRight, Shield, Wifi, Globe, Database, Lock, Server, Eye, Zap,
  Cpu, Bug, Smartphone, Cloud, Crosshair, Search, Key,
  Radio, List, Activity, Target, ShieldAlert, FolderSearch, Fingerprint, Users, Home, LogOut, AlertTriangle, HardDrive, Route, GraduationCap, FlaskConical, Link2,
  Briefcase, Plus, Trash2
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const TOOLS_CONFIG: Tool[] = [
  // 🎓 Metodología & Playbooks (certificaciones)
  { id: ModuleType.PLAYBOOK_AD_ATTACK_PATH, name: 'AD Attack Path', description: 'Recon → Kerberoasting → lateral → DCSync · OSCP · CRTP · CRTE', icon: 'GraduationCap', category: ModuleCategory.METHODOLOGY },
  { id: ModuleType.PLAYBOOK_PIVOTING, name: 'Pivoting & Tunneling', description: 'Chisel, Ligolo-ng, SSH, proxychains · OSCP · CRTO', icon: 'Route', category: ModuleCategory.METHODOLOGY },
  { id: ModuleType.PLAYBOOK_WEB_API, name: 'Web & API Methodology', description: 'OWASP Top 10 / API Top 10 · OSWE · eWPT · CPTS · BSCP', icon: 'Globe', category: ModuleCategory.METHODOLOGY },
  { id: ModuleType.PLAYBOOK_PRIVESC, name: 'Privilege Escalation', description: 'Windows & Linux, checklist completa · OSCP · eCPPT · PNPT', icon: 'Zap', category: ModuleCategory.METHODOLOGY },
  { id: ModuleType.PLAYBOOK_BUFFER_OVERFLOW, name: 'Buffer Overflow & Exploit Dev', description: 'Fuzzing → EIP → shellcode, paso a paso · OSCP · OSED', icon: 'FlaskConical', category: ModuleCategory.METHODOLOGY },
  { id: ModuleType.PLAYBOOK_REDTEAM_C2, name: 'Red Team Ops & C2/Evasion', description: 'Infra, Malleable C2, AV/EDR evasion, OPSEC · CRTO · OSEP', icon: 'Crosshair', category: ModuleCategory.METHODOLOGY },
  { id: ModuleType.PLAYBOOK_MOBILE, name: 'Mobile Pentesting (MASVS)', description: 'Static + dynamic, mapeado a OWASP MASVS · eMAPT', icon: 'Smartphone', category: ModuleCategory.METHODOLOGY },
  { id: ModuleType.PLAYBOOK_CLOUD, name: 'Cloud Security (AWS/Azure)', description: 'IAM, privesc y lateral en la nube · MITRE ATT&CK Cloud', icon: 'Cloud', category: ModuleCategory.METHODOLOGY },
  { id: ModuleType.PLAYBOOK_WIRELESS, name: 'Wireless Pentesting', description: 'Handshake, PMKID, WPS Pixie-Dust · OSWP', icon: 'Radio', category: ModuleCategory.METHODOLOGY },
  { id: ModuleType.PLAYBOOK_OSINT_RECON, name: 'OSINT & Recon Estructurado', description: 'Mapa de superficie de ataque antes de explotar · eJPT · CPTS · CEH', icon: 'Search', category: ModuleCategory.METHODOLOGY },
  { id: ModuleType.PLAYBOOK_REPORT_WRITING, name: 'Redacción de Informes', description: 'Estructura y CVSS grado examen · OSCP · CREST · CPTS', icon: 'FileText', category: ModuleCategory.METHODOLOGY },

  // 🕵️ Inteligencia & OSINT
  { id: ModuleType.OSINT_SHERLOCK, name: 'Sherlock', description: 'Búsqueda de Usuarios', icon: 'Search', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.OSINT_MALTEGO, name: 'Maltego', description: 'Análisis de Enlaces', icon: 'Eye', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.OSINT_RECON_NG, name: 'Recon-ng', description: 'OSINT Framework', icon: 'Target', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.CIBER_INTEL_MISP, name: 'MISP Intel', description: 'Threat Hunting Feeds', icon: 'Activity', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.DOXING_LEAKS, name: 'Doxing & Leaks', description: 'Correos y Fugas', icon: 'Database', category: ModuleCategory.INTELLIGENCE },

  // 🎯 Recon & Bug Bounty
  { id: ModuleType.RECON_NMAP, name: 'Nmap', description: 'Port & Service Scan', icon: 'TerminalIcon', category: ModuleCategory.BUG_BOUNTY },
  { id: ModuleType.RECON_MASSCAN, name: 'Masscan', description: 'Escaneo asíncrono', icon: 'Zap', category: ModuleCategory.BUG_BOUNTY },
  { id: ModuleType.BUG_BOUNTY_RECON, name: 'Subfinder/Amass', description: 'Reconocimiento Masivo', icon: 'Globe', category: ModuleCategory.BUG_BOUNTY },
  { id: ModuleType.BUG_BOUNTY_HTTPX, name: 'Httpx', description: 'Sondeo de activos vivos', icon: 'Activity', category: ModuleCategory.BUG_BOUNTY },
  { id: ModuleType.BUG_BOUNTY_VULN_NUCLEI, name: 'Nuclei', description: 'Vuln Scanning rápido', icon: 'Bug', category: ModuleCategory.BUG_BOUNTY },
  { id: ModuleType.BUG_BOUNTY_VULN_NESSUS, name: 'Nessus / OpenVAS', description: 'Escáner de Infraestructura', icon: 'ShieldAlert', category: ModuleCategory.BUG_BOUNTY },

  // ☁️ Cloud Security
  { id: ModuleType.CLOUD_AWS_PACU, name: 'AWS Pacu', description: 'Auditoría AWS', icon: 'Cloud', category: ModuleCategory.CLOUD_SECURITY },
  { id: ModuleType.CLOUD_AZURE_HOUND, name: 'AzureHound', description: 'Auditoría Azure AD', icon: 'Cloud', category: ModuleCategory.CLOUD_SECURITY },

  // 📱 Mobile Hacking
  { id: ModuleType.MOBILE_STATIC, name: 'MobSF', description: 'Análisis Estático', icon: 'Smartphone', category: ModuleCategory.MOBILE_HACKING },
  { id: ModuleType.MOBILE_DYNAMIC, name: 'Frida/Objection', description: 'Dynamic Hooking', icon: 'Smartphone', category: ModuleCategory.MOBILE_HACKING },

  // 🛠️ Weaponization & C2
  { id: ModuleType.COBALT_STRIKE, name: 'Cobalt Strike', description: 'Advanced C2', icon: 'Crosshair', category: ModuleCategory.WEAPONIZATION },
  { id: ModuleType.SLIVER_C2, name: 'Sliver C2', description: 'Implant Framework', icon: 'Crosshair', category: ModuleCategory.WEAPONIZATION },
  { id: ModuleType.HAVOC_C2, name: 'Havoc C2', description: 'Modern C2 Framework', icon: 'Crosshair', category: ModuleCategory.WEAPONIZATION },
  { id: ModuleType.PAYLOAD_GEN, name: 'MSFVenom / Villain', description: 'Generación de Payloads', icon: 'Zap', category: ModuleCategory.WEAPONIZATION },
  { id: ModuleType.SOCIAL_ENGINEERING, name: 'SET Toolkit', description: 'Ingeniería Social', icon: 'Users', category: ModuleCategory.WEAPONIZATION },
  { id: ModuleType.PHISHING_PREP, name: 'GoPhish', description: 'Campañas Phishing', icon: 'Target', category: ModuleCategory.WEAPONIZATION },

  // 🌐 Web Hacking
  { id: ModuleType.BURP_CAIDO, name: 'Burp / Caido', description: 'Proxies de Intercepción', icon: 'Globe', category: ModuleCategory.WEB_HACKING },
  { id: ModuleType.WHATWEB_CURL, name: 'WhatWeb / cURL / Wget', description: 'CLI Fingerprinting', icon: 'TerminalIcon', category: ModuleCategory.WEB_HACKING },
  { id: ModuleType.NIKTO, name: 'Nikto', description: 'Scanner Web Server', icon: 'List', category: ModuleCategory.WEB_HACKING },
  { id: ModuleType.GOBUSTER_FFUF, name: 'Gobuster / Ffuf / DirBuster', description: 'Fuzzing & Directorios', icon: 'FolderSearch', category: ModuleCategory.WEB_HACKING },
  { id: ModuleType.SQLMAP, name: 'SQLmap', description: 'Inyección SQL', icon: 'Database', category: ModuleCategory.WEB_HACKING },
  { id: ModuleType.COMMIX, name: 'Commix', description: 'Command Injection', icon: 'TerminalIcon', category: ModuleCategory.WEB_HACKING },
  { id: ModuleType.WPSCAN_CMS, name: 'WPScan / CMS', description: 'Auditoría CMS', icon: 'FileText', category: ModuleCategory.WEB_HACKING },
  { id: ModuleType.OWASP_ZAP, name: 'OWASP ZAP', description: 'Web Scanner', icon: 'Shield', category: ModuleCategory.WEB_HACKING },

  // 🔓 Initial Access
  { id: ModuleType.METASPLOIT, name: 'Metasploit Framework', description: 'Exploitation Core', icon: 'TerminalIcon', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.RESPONDER, name: 'Responder', description: 'LLMNR/NBT-NS Poisoning', icon: 'Wifi', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.HYDRA_HASHCAT, name: 'Hydra / Hashcat / John', description: 'Brute Force & Rainbow Tables', icon: 'Lock', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.WIFITE, name: 'Wifite 2', description: 'Auto-Wifi Audit', icon: 'Radio', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.BETTERCAP, name: 'Bettercap', description: 'MITM / BLE / Wifi', icon: 'Radio', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.KISMET, name: 'Kismet', description: 'Wireless Sniffer', icon: 'Radio', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.WIFI_ATTACKS, name: 'Aircrack-ng', description: 'Suite Manual Wifi', icon: 'Wifi', category: ModuleCategory.INITIAL_ACCESS },

  // 🚩 Post Exploitation
  { id: ModuleType.PRIV_ESC, name: 'LinPEAS / WinPEAS', description: 'Escalada de Privilegios', icon: 'Zap', category: ModuleCategory.POST_EXPLOITATION },
  { id: ModuleType.ACTIVE_DIRECTORY, name: 'Bloodhound / Impacket', description: 'Active Directory', icon: 'Server', category: ModuleCategory.POST_EXPLOITATION },
  { id: ModuleType.CRACKMAPEXEC, name: 'CrackMapExec', description: 'NetExec / SMB Spray', icon: 'Server', category: ModuleCategory.POST_EXPLOITATION },
  { id: ModuleType.MIMIKATZ, name: 'Mimikatz', description: 'Credential Dumping', icon: 'Key', category: ModuleCategory.POST_EXPLOITATION },
  { id: ModuleType.PERSISTENCE, name: 'Persistencia', description: 'Backdoors / Tareas', icon: 'Shield', category: ModuleCategory.POST_EXPLOITATION },

  // 🔍 Análisis Forense & DFIR
  { id: ModuleType.FORENSICS_AUTOPSY, name: 'Autopsy', description: 'Análisis de Artefactos', icon: 'Fingerprint', category: ModuleCategory.FORENSICS },
  { id: ModuleType.FORENSICS_VOLATILITY, name: 'Volatility 3', description: 'Análisis en Memoria', icon: 'Cpu', category: ModuleCategory.FORENSICS },
  { id: ModuleType.FORENSICS_WIRESHARK, name: 'Wireshark', description: 'Análisis de PCAP', icon: 'Activity', category: ModuleCategory.FORENSICS },

  // 📊 Reporting
  { id: ModuleType.REPORT_GENERATOR, name: 'Report Builder', description: 'Generar Informe Final', icon: 'FileText', category: ModuleCategory.REPORTING },
];

const CATEGORY_ACCENT: Record<ModuleCategory, string> = {
  [ModuleCategory.METHODOLOGY]: '#facc15',
  [ModuleCategory.INTELLIGENCE]: '#22d3ee',
  [ModuleCategory.BUG_BOUNTY]: '#f43f5e',
  [ModuleCategory.CLOUD_SECURITY]: '#38bdf8',
  [ModuleCategory.MOBILE_HACKING]: '#e879f9',
  [ModuleCategory.WEAPONIZATION]: '#ef4444',
  [ModuleCategory.WEB_HACKING]: '#fb923c',
  [ModuleCategory.INITIAL_ACCESS]: '#a78bfa',
  [ModuleCategory.POST_EXPLOITATION]: '#f472b6',
  [ModuleCategory.FORENSICS]: '#10b981',
  [ModuleCategory.REPORTING]: '#94a3b8',
};

const loadSessionsFromStorage = (): Record<string, Message[]> => {
  try {
    const saved = localStorage.getItem('aegis_sessions');
    if (!saved) return {};
    const parsed = JSON.parse(saved) as Record<string, Message[]>;
    Object.values(parsed).forEach((msgs) => msgs.forEach((m) => { m.timestamp = new Date(m.timestamp); }));
    return parsed;
  } catch {
    return {};
  }
};

const sessionKey = (engagementId: string, module: string) => `${engagementId}::${module}`;

// Un "engagement" agrupa las sesiones por target/cliente. Antes de que existiera este
// concepto, las sesiones vivían en localStorage con el moduleId como clave plana; esta
// migración las mueve una sola vez a un engagement por defecto sin perder el historial.
const loadEngagementsAndSessions = (): { engagements: Engagement[]; activeEngagementId: string; sessions: Record<string, Message[]> } => {
  const rawSessions = loadSessionsFromStorage();
  let engagements: Engagement[] = [];
  try {
    const saved = localStorage.getItem('aegis_engagements');
    if (saved) engagements = JSON.parse(saved);
  } catch {
    engagements = [];
  }

  if (engagements.length === 0) {
    const defaultEngagement: Engagement = { id: uuidv4(), name: 'Engagement por defecto', createdAt: new Date().toISOString() };
    const migrated: Record<string, Message[]> = {};
    Object.entries(rawSessions).forEach(([key, msgs]) => {
      const newKey = key.includes('::') ? key : sessionKey(defaultEngagement.id, key);
      migrated[newKey] = msgs;
    });
    return { engagements: [defaultEngagement], activeEngagementId: defaultEngagement.id, sessions: migrated };
  }

  const savedActiveId = localStorage.getItem('aegis_active_engagement');
  const activeEngagementId = (savedActiveId && engagements.some(e => e.id === savedActiveId)) ? savedActiveId : engagements[0].id;
  return { engagements, activeEngagementId, sessions: rawSessions };
};

const App: FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('aegis_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [aiProvider, setAiProvider] = useState<AIProviderId>(() => {
    return (localStorage.getItem('aegis_ai_provider') as AIProviderId) || 'gemini';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('aegis_language') as Language) || 'es';
  });

  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    if (userProfile) localStorage.setItem('aegis_user_profile', JSON.stringify(userProfile));
    else localStorage.removeItem('aegis_user_profile');
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('aegis_ai_provider', aiProvider);
  }, [aiProvider]);

  useEffect(() => {
    localStorage.setItem('aegis_language', language);
  }, [language]);

  const refreshHealth = () => { fetchHealth().then(setHealth); };
  useEffect(() => { refreshHealth(); }, []);

  const [bootDone, setBootDone] = useState(false);
  const [clock, setClock] = useState(() => new Date().toLocaleTimeString());
  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const [loginName, setLoginName] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'module' | 'links'>('dashboard');
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.RECON_NMAP);

  const [initState] = useState(loadEngagementsAndSessions);
  const [engagements, setEngagements] = useState<Engagement[]>(initState.engagements);
  const [activeEngagementId, setActiveEngagementId] = useState<string>(initState.activeEngagementId);
  const [sessionsData, setSessionsData] = useState<Record<string, Message[]>>(initState.sessions);
  const [engagementMenuOpen, setEngagementMenuOpen] = useState(false);
  const [newEngagementName, setNewEngagementName] = useState('');

  useEffect(() => {
    localStorage.setItem('aegis_sessions', JSON.stringify(sessionsData));
  }, [sessionsData]);

  useEffect(() => {
    localStorage.setItem('aegis_engagements', JSON.stringify(engagements));
  }, [engagements]);

  useEffect(() => {
    localStorage.setItem('aegis_active_engagement', activeEngagementId);
  }, [activeEngagementId]);

  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<AuditReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    [ModuleCategory.METHODOLOGY]: true,
    [ModuleCategory.INTELLIGENCE]: false,
    [ModuleCategory.BUG_BOUNTY]: false,
    [ModuleCategory.CLOUD_SECURITY]: false,
    [ModuleCategory.MOBILE_HACKING]: false,
    [ModuleCategory.WEAPONIZATION]: false,
    [ModuleCategory.WEB_HACKING]: false,
    [ModuleCategory.INITIAL_ACCESS]: false,
    [ModuleCategory.POST_EXPLOITATION]: false,
    [ModuleCategory.FORENSICS]: false,
    [ModuleCategory.REPORTING]: false,
  });

  const toggleCategory = (cat: string) => setExpandedCategories(prev => ({...prev, [cat]: !prev[cat]}));

  const getIcon = (iconName: string) => {
    const icons: any = { TerminalIcon, Globe, Eye, Wifi, Zap, Database, FileText, Shield, Lock, Server, Cpu, Bug, Smartphone, Cloud, Crosshair, Search, Key, Radio, List, Activity, Target, ShieldAlert, FolderSearch, Fingerprint, Users, Route, GraduationCap, FlaskConical };
    const Icon = icons[iconName] || TerminalIcon;
    return <Icon size={18} />;
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) return;

    const cleanName = loginName.trim().replace(/\s+/g, ' ');
    const parts = cleanName.split(' ');
    let initials = parts[0][0];
    if (parts.length > 1) initials += parts[parts.length - 1][0];
    else if (cleanName.length > 1) initials += cleanName[1];

    setUserProfile({ name: cleanName, initials: initials.toUpperCase(), role: 'Senior Auditor' });
  };

  const addMessage = (engagementId: string, module: string, content: string, role: 'user' | 'model' | 'system') => {
    const key = sessionKey(engagementId, module);
    const newMessage: Message = { id: uuidv4(), role, content, timestamp: new Date() };
    setSessionsData(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), newMessage]
    }));
  };

  const runInitFlow = async (engagementId: string, module: ModuleType) => {
    setIsLoading(true);
    try {
      const reply = await initializeChat(module, aiProvider, language);
      addMessage(engagementId, module, reply, 'model');
    } catch (e) {
      addMessage(engagementId, module, `Error crítico: Fallo en inicialización de IA (${aiProvider === 'gemini' ? 'Gemini' : 'Ollama Local'}). Verifica el motor en OPSEC & SYSTEM.`, 'system');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModuleSelect = (module: ModuleType) => {
    setActiveModule(module);
    setCurrentView('module');

    const key = sessionKey(activeEngagementId, module);
    if (sessionsData[key] && sessionsData[key].length > 0) {
        return;
    }

    void runInitFlow(activeEngagementId, module);
  };

  const handleUserMessage = async (text: string) => {
    const currentMod = activeModule;
    const currentEng = activeEngagementId;
    const history = toChatHistory(sessionsData[sessionKey(currentEng, currentMod)] || []);
    addMessage(currentEng, currentMod, text, 'user');
    setIsLoading(true);
    try {
      const response = await sendMessage(currentMod, aiProvider, language, history, text);
      addMessage(currentEng, currentMod, response, 'model');
    } catch (e) {
      addMessage(currentEng, currentMod, "Error de conexión con el núcleo de IA.", 'system');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    const currentMod = activeModule;
    const currentEng = activeEngagementId;
    setIsLoading(true);
    addMessage(currentEng, currentMod, "Iniciando compilación de evidencias...", 'system');
    try {
        const history = toChatHistory(sessionsData[sessionKey(currentEng, currentMod)] || []);
        const report = await generateReportData(currentMod, aiProvider, language, history, userProfile?.name || 'Unknown');
        if (report) {
            setReportData(report);
            setIsReportModalOpen(true);
            addMessage(currentEng, currentMod, "Reporte generado exitosamente.", 'system');
        } else {
            addMessage(currentEng, currentMod, "Error generando reporte: La IA no devolvió datos estructurados válidos.", 'system');
        }
    } catch (e) {
        addMessage(currentEng, currentMod, "Error crítico al generar reporte.", 'system');
    } finally {
        setIsLoading(false);
    }
  };

  const handleClearSession = async () => {
    const key = sessionKey(activeEngagementId, activeModule);
    setSessionsData(prev => ({ ...prev, [key]: [] }));
    await runInitFlow(activeEngagementId, activeModule);
  };

  const activeEngagement = engagements.find(e => e.id === activeEngagementId);

  const handleSwitchEngagement = (id: string) => {
    setActiveEngagementId(id);
    setEngagementMenuOpen(false);
    if (currentView === 'module') {
      const key = sessionKey(id, activeModule);
      if (!sessionsData[key] || sessionsData[key].length === 0) {
        void runInitFlow(id, activeModule);
      }
    }
  };

  const handleCreateEngagement = () => {
    const name = newEngagementName.trim();
    if (!name) return;
    const newEng: Engagement = { id: uuidv4(), name, createdAt: new Date().toISOString() };
    setEngagements(prev => [...prev, newEng]);
    setActiveEngagementId(newEng.id);
    setNewEngagementName('');
    setEngagementMenuOpen(false);
  };

  const handleDeleteEngagement = (id: string) => {
    if (engagements.length <= 1) return;
    if (!window.confirm('¿Eliminar este engagement y todas sus sesiones? Esta acción no se puede deshacer.')) return;
    setEngagements(prev => prev.filter(e => e.id !== id));
    setSessionsData(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { if (k.startsWith(`${id}::`)) delete next[k]; });
      return next;
    });
    if (activeEngagementId === id) {
      const remaining = engagements.filter(e => e.id !== id);
      setActiveEngagementId(remaining[0]?.id ?? '');
    }
  };

  const activeToolObj = TOOLS_CONFIG.find(t => t.id === activeModule);
  const activeToolName = activeToolObj ? activeToolObj.name.toUpperCase() : activeModule;

  const currentMessages = sessionsData[sessionKey(activeEngagementId, activeModule)] || [];

  if (!userProfile) {
    if (!bootDone) {
      return <BootSequence onDone={() => setBootDone(true)} />;
    }
    return (
      <div className="h-screen w-full bg-[#0a0a0c] flex items-center justify-center relative overflow-hidden">
        <TacticalOverlay />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#f43f5e_0%,transparent_50%)]"></div>
        <div className="z-10 bg-surface border border-gray-800 p-8 rounded-sm shadow-2xl w-full max-w-md text-center">
            <Logo className="w-24 h-24 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2 hover:animate-glitch cursor-default">AEGIS</h1>
            <h2 className="text-sm text-rose-500 tracking-[0.4em] mb-8">RED HORIZON ACCESS</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Enter tu nombre o alias de CTF..." className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded-lg focus:border-rose-500 focus:outline-none transition-colors" autoFocus />
                <button type="submit" className="w-full bg-gradient-to-r from-slate-700 to-rose-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">AUTHENTICATE</button>
            </form>
            <div className="mt-8 text-xs text-gray-600">Created by César Matute</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background text-gray-200 overflow-hidden font-sans">
      <TacticalOverlay />
      {isReportModalOpen && reportData && (<ReportModal report={reportData} onClose={() => setIsReportModalOpen(false)} />)}
      {settingsOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-gray-700 p-6 rounded-lg w-full max-w-md shadow-2xl relative">
            <button onClick={() => setSettingsOpen(false)} title="Cerrar panel" aria-label="Cerrar panel" className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X /></button>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-rose-500">
                <Settings size={20} /> OPSEC & SYSTEM
            </h2>

            <div className="space-y-6">
                {/* 1. System Status */}
                <div className="bg-[#0a0a0c] border border-gray-800 p-4 rounded-lg shadow-inner">
                    <h3 className="text-[10px] text-gray-500 font-bold tracking-widest mb-3 uppercase">Conectividad del C2</h3>
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-300 font-medium">☁️ Gemini 2.5 (Cloud)</span>
                        {health === null ? (
                          <span className="text-gray-500 font-mono text-xs">CHECKING...</span>
                        ) : health.gemini ? (
                          <span className="flex items-center gap-2 text-green-500 font-mono text-xs"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> ONLINE</span>
                        ) : (
                          <span className="flex items-center gap-2 text-red-500 font-mono text-xs"><span className="w-2 h-2 rounded-full bg-red-500"></span> SIN API KEY</span>
                        )}
                    </div>
                    <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-300 font-medium">🖥️ Ollama (Local · Uncensored)</span>
                        {health === null ? (
                          <span className="text-gray-500 font-mono text-xs">CHECKING...</span>
                        ) : health.ollama ? (
                          <span className="flex items-center gap-2 text-green-500 font-mono text-xs"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> ONLINE</span>
                        ) : (
                          <span className="flex items-center gap-2 text-red-500 font-mono text-xs"><span className="w-2 h-2 rounded-full bg-red-500"></span> OFFLINE</span>
                        )}
                    </div>
                    {health && (
                      <p className="text-[10px] text-gray-600 mb-2">Modelo local configurado: <span className="text-gray-400 font-mono">{health.ollamaModel}</span></p>
                    )}
                    <button
                        onClick={refreshHealth}
                        className="flex items-center justify-center gap-2 w-full py-2 mt-1 bg-gray-800/50 hover:bg-gray-700/60 text-gray-300 border border-gray-700 rounded transition-colors text-xs font-bold"
                    >
                        REVALIDAR CONECTIVIDAD
                    </button>
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 mt-2 bg-blue-900/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-800/50 rounded transition-colors text-xs font-bold"
                        title="Abre Google AI Studio en una nueva pestaña"
                    >
                        OBTENER API KEY GRATUITA EN GOOGLE AI STUDIO ↗
                    </a>
                </div>

                {/* 2. AI Engine Selector */}
                <div className="bg-[#0a0a0c] border border-gray-800 p-4 rounded-lg shadow-inner">
                    <h3 className="text-[10px] text-gray-500 font-bold tracking-widest mb-3 uppercase">Motor de IA Activo</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setAiProvider('gemini')}
                            className={`flex flex-col items-center gap-1 py-3 rounded-lg border text-xs font-bold transition-colors ${aiProvider === 'gemini' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'border-gray-700 text-gray-500 hover:border-gray-600'}`}
                        >
                            <Cloud size={18} /> CLOUD
                            <span className="text-[9px] font-normal opacity-70">Gemini 2.5</span>
                        </button>
                        <button
                            onClick={() => setAiProvider('ollama')}
                            className={`flex flex-col items-center gap-1 py-3 rounded-lg border text-xs font-bold transition-colors ${aiProvider === 'ollama' ? 'bg-terminal/20 border-terminal text-terminal' : 'border-gray-700 text-gray-500 hover:border-gray-600'}`}
                        >
                            <HardDrive size={18} /> LOCAL
                            <span className="text-[9px] font-normal opacity-70">Ollama · Sin censura</span>
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-3">LOCAL mantiene todo el tráfico de la auditoría dentro de tu máquina — recomendado para engagements bajo NDA.</p>
                </div>

                {/* 3. Language */}
                <div className="bg-[#0a0a0c] border border-gray-800 p-4 rounded-lg shadow-inner">
                    <h3 className="text-[10px] text-gray-500 font-bold tracking-widest mb-3 uppercase">Idioma de la IA</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setLanguage('es')} className={`py-2 rounded-lg border text-xs font-bold transition-colors ${language === 'es' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'border-gray-700 text-gray-500 hover:border-gray-600'}`}>ESPAÑOL</button>
                        <button onClick={() => setLanguage('en')} className={`py-2 rounded-lg border text-xs font-bold transition-colors ${language === 'en' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'border-gray-700 text-gray-500 hover:border-gray-600'}`}>ENGLISH</button>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-3">Aplica desde el próximo mensaje o módulo nuevo. Para forzarlo en una sesión ya iniciada, usa LIMPIAR en esa terminal (los modelos LOCAL siguen peor el cambio a mitad de conversación que Gemini).</p>
                </div>

                {/* 4. Operator Profile */}
                <div className="bg-[#0a0a0c] border border-gray-800 p-4 rounded-lg shadow-inner">
                    <h3 className="text-[10px] text-gray-500 font-bold tracking-widest mb-3 uppercase">Perfil de Operador</h3>
                    <div className="space-y-2">
                        <label htmlFor="operator-alias" className="text-xs text-gray-400">Alias / Callsign</label>
                        <input
                            id="operator-alias"
                            type="text"
                            title="Alias del operador"
                            aria-label="Alias del operador"
                            placeholder="Introduce tu alias..."
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                            className="w-full bg-black/50 border border-gray-700 text-rose-500 font-bold p-2 rounded focus:border-rose-500 focus:outline-none text-sm"
                        />
                    </div>
                </div>

                {/* 5. Panic Button */}
                <div className="pt-2">
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-600 text-red-500 hover:text-white border border-red-900/50 hover:border-red-500 font-bold py-3 rounded-lg transition-all duration-300 hover:animate-glitch"
                        title="Borra todos los datos locales y cierra sesión"
                    >
                        <AlertTriangle size={18} />
                        PANIC BUTTON (Wipe Data)
                    </button>
                    <p className="text-center text-[10px] text-gray-500 mt-2">Destruye la sesión actual, el historial local y limpia el LocalStorage.</p>
                </div>
            </div>
          </div>
        </div>
      )}
      <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-surface border border-gray-700 rounded-md shadow-lg" onClick={() => setSidebarOpen(!sidebarOpen)} title={sidebarOpen ? "Cerrar menú" : "Abrir menú"} aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}>{sidebarOpen ? <X /> : <Menu />}</button>
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform fixed md:relative z-40 w-72 h-full bg-surface border-r border-gray-800 flex flex-col shadow-2xl`}>
        <div className="p-6 border-b border-gray-800 flex flex-col items-center relative">
          <button onClick={() => setSettingsOpen(true)} title="Configuración del sistema" aria-label="Configuración del sistema" className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><Settings size={16} /></button>
          <Logo className="w-16 h-16 mb-3" />
          <h1 className="text-lg font-bold tracking-wider text-white text-center hover:animate-glitch cursor-default">AEGIS<br/><span className="text-xs tracking-[0.3em] text-rose-500">RED HORIZON</span></h1>
        </div>
        <div className="px-6 py-2 flex items-center justify-between text-[10px] font-mono text-gray-500 border-b border-gray-800/70">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-terminal"></span>
            </span>
            LINK STABLE
          </span>
          <span>{clock}</span>
        </div>
        <div className="px-4 py-2 mt-2 relative">
          <button
            onClick={() => setEngagementMenuOpen(o => !o)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-[#0a0a0c] border border-gray-800 rounded-lg text-left hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Briefcase size={14} className="text-rose-500 shrink-0" />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{activeEngagement?.name || 'Sin engagement'}</div>
                {activeEngagement?.target && <div className="text-[10px] text-gray-500 truncate">{activeEngagement.target}</div>}
              </div>
            </div>
            <ChevronDown size={14} className="text-gray-500 shrink-0" />
          </button>
          {engagementMenuOpen && (
            <div className="absolute left-4 right-4 mt-1 z-50 bg-[#0a0a0c] border border-gray-800 rounded-lg p-2 space-y-1 shadow-2xl max-h-64 overflow-y-auto">
              {engagements.map(eng => (
                <div key={eng.id} className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded ${eng.id === activeEngagementId ? 'bg-rose-500/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                  <button onClick={() => handleSwitchEngagement(eng.id)} className="flex-1 text-left text-xs truncate">{eng.name}</button>
                  {engagements.length > 1 && (
                    <button onClick={() => handleDeleteEngagement(eng.id)} title="Eliminar engagement" aria-label="Eliminar engagement" className="text-gray-600 hover:text-red-500 shrink-0"><Trash2 size={12} /></button>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t border-gray-800 flex gap-1">
                <input
                  type="text"
                  value={newEngagementName}
                  onChange={(e) => setNewEngagementName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreateEngagement(); }}
                  placeholder="Nombre / target nuevo..."
                  title="Nombre del nuevo engagement"
                  className="flex-1 bg-black/40 border border-gray-700 text-white text-xs px-2 py-1.5 rounded focus:border-rose-500 focus:outline-none"
                />
                <button onClick={handleCreateEngagement} title="Crear engagement" aria-label="Crear engagement" className="px-2 bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors"><Plus size={14} /></button>
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-2 mt-2 space-y-1">
          <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-rose-500/20 text-white border border-rose-500/50' : 'text-gray-400 hover:bg-white/5'}`}><Home size={18} /><span className="font-bold text-sm">DASHBOARD</span></button>
          <button onClick={() => setCurrentView('links')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'links' ? 'bg-rose-500/20 text-white border border-rose-500/50' : 'text-gray-400 hover:bg-white/5'}`}><Link2 size={18} /><span className="font-bold text-sm">RECURSOS & OSINT</span></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-0 space-y-0 custom-scrollbar">
          {Object.values(ModuleCategory).map((category) => (
            <div key={category} className="border-b border-gray-800/50">
              <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"><span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_ACCENT[category] }}></span>{category}</span>{expandedCategories[category] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
              {expandedCategories[category] && (
                <div className="bg-[#0f0f13] pb-2">
                  {TOOLS_CONFIG.filter(t => t.category === category).map(tool => (
                    <button key={tool.id} onClick={() => { handleModuleSelect(tool.id); if (window.innerWidth < 768) setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-6 py-2 text-sm border-l-2 transition-all duration-200 ${activeModule === tool.id && currentView === 'module' ? 'border-rose-500 bg-rose-500/10 text-white' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}><span className={activeModule === tool.id && currentView === 'module' ? 'text-rose-500' : ''}>{getIcon(tool.icon)}</span><div className="text-left"><div className="font-medium leading-none mb-1">{tool.name}</div></div></button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="p-4 bg-[#08080a] border-t border-gray-800 flex items-center gap-3">
           <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">{userProfile.initials}</div>
           <div className="flex-1 overflow-hidden"><div className="text-sm font-bold text-white truncate">{userProfile.name}</div><div className="text-xs text-rose-500 truncate">{userProfile.role}</div></div>
           <button onClick={() => { setUserProfile(null); localStorage.removeItem('aegis_user_profile'); }} title="Cerrar sesión" aria-label="Cerrar sesión" className="text-gray-500 hover:text-red-500 transition-colors"><LogOut size={16} /></button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col relative h-full bg-[#0a0a0c]">
        {currentView === 'dashboard' && (
            <div className="h-full overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 flex justify-between items-end">
                        <div><h2 className="text-3xl font-bold text-white mb-2">Command Center</h2><p className="text-gray-400">Bienvenido, {userProfile.name}. Plataforma lista para CTFs y Auditorías.</p></div>
                        <div className="flex gap-4 text-xs font-mono text-gray-500"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> ONLINE</span></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {TOOLS_CONFIG.map((tool, idx) => {
                            const accent = CATEGORY_ACCENT[tool.category];
                            return (
                            <button
                                key={tool.id}
                                onClick={() => handleModuleSelect(tool.id)}
                                style={{ borderLeftColor: accent }}
                                className="relative bg-surface border border-gray-800 border-l-4 rounded-sm p-5 hover:bg-surface/80 hover:border-l-[6px] transition-all group text-left"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-sm bg-gray-900 group-hover:scale-110 transition-transform" style={{ color: accent }}>{getIcon(tool.icon)}</div>
                                    <span className="text-[9px] font-mono font-bold text-gray-600 bg-black/30 px-2 py-1 rounded-sm">[MOD-{String(idx + 1).padStart(2, '0')}]</span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1 group-hover:text-rose-400 transition-colors">{tool.name}</h3>
                                <p className="text-xs text-gray-500">{tool.description}</p>
                                <div className="mt-3 text-[9px] uppercase font-bold tracking-wider truncate" style={{ color: accent }}>{tool.category.split('&')[0]}</div>
                            </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}
        {currentView === 'links' && (<LinksPanel />)}
        {currentView === 'module' && (<Terminal messages={currentMessages} onSendMessage={handleUserMessage} onGenerateReport={handleGenerateReport} onClearSession={handleClearSession} isLoading={isLoading} activeModule={activeModule} activeModuleName={activeToolName} activeProvider={aiProvider} />)}
      </main>
    </div>
  );
};
export default App;
