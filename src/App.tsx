import { useState, useEffect, FC, FormEvent } from 'react';
import { ModuleType, Message, Tool, ModuleCategory, UserProfile, AuditReport, AIProviderId, Language, Engagement, BoardFinding, FindingStatus, Severity } from './types';
import { initializeChat, sendMessage, generateReportData, toChatHistory, fetchHealth, HealthStatus } from './services/aiClient';
import { Terminal } from './components/Terminal';
import { Logo } from './components/Logo';
import { ReportModal } from './components/ReportModal';
import { TacticalOverlay } from './components/TacticalOverlay';
import { BootSequence } from './components/BootSequence';
import { LinksPanel } from './components/LinksPanel';
import { FindingsBoard } from './components/FindingsBoard';
import { SplitTerminalView } from './components/SplitTerminalView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { sessionKey } from './utils/sessionKey';
import { isEncryptionEnabled, setupEncryption, unlockEncryption, disableEncryption, wipeEncryptedData, encryptString, decryptString } from './services/vault';
import {
  Terminal as TerminalIcon, Settings, FileText, Menu, X, ChevronDown,
  ChevronRight, Shield, Wifi, Globe, Database, Lock, Server, Eye, Zap,
  Cpu, Bug, Smartphone, Cloud, Crosshair, Search, Key,
  Radio, List, Activity, Target, ShieldAlert, FolderSearch, Fingerprint, Users, Home, LogOut, AlertTriangle, HardDrive, Route, GraduationCap, FlaskConical, Link2,
  Briefcase, Plus, Trash2, Kanban, Download, Upload
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
  { id: ModuleType.OSINT_THEHARVESTER, name: 'theHarvester', description: 'Correos, subdominios y empleados desde fuentes públicas', icon: 'Database', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.OSINT_SHERLOCK, name: 'Sherlock', description: 'Búsqueda de Usuarios', icon: 'Search', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.OSINT_MALTEGO, name: 'Maltego', description: 'Análisis de Enlaces', icon: 'Eye', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.OSINT_RECON_NG, name: 'Recon-ng', description: 'OSINT Framework', icon: 'Target', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.CIBER_INTEL_MISP, name: 'MISP Intel', description: 'Threat Hunting Feeds', icon: 'Activity', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.DOXING_LEAKS, name: 'Doxing & Leaks', description: 'Correos y Fugas', icon: 'Database', category: ModuleCategory.INTELLIGENCE },

  // 🎯 Recon & Bug Bounty
  { id: ModuleType.RECON_NETDISCOVER, name: 'Netdiscover / ARP-Scan', description: 'Descubrimiento de hosts vivos antes de escanear puertos', icon: 'Wifi', category: ModuleCategory.BUG_BOUNTY },
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
  { id: ModuleType.POWERSHELL_EMPIRE, name: 'PowerShell Empire', description: 'C2 open source de PowerShell tradecraft', icon: 'Crosshair', category: ModuleCategory.WEAPONIZATION },
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
  { id: ModuleType.EVIL_WINRM, name: 'Evil-WinRM', description: 'Shell WinRM con credenciales o pass-the-hash', icon: 'TerminalIcon', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.RESPONDER, name: 'Responder', description: 'LLMNR/NBT-NS Poisoning', icon: 'Wifi', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.HYDRA_HASHCAT, name: 'Hydra / Hashcat / John', description: 'Brute Force & Rainbow Tables', icon: 'Lock', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.WIFITE, name: 'Wifite 2', description: 'Auto-Wifi Audit', icon: 'Radio', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.BETTERCAP, name: 'Bettercap', description: 'MITM / BLE / Wifi', icon: 'Radio', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.KISMET, name: 'Kismet', description: 'Wireless Sniffer', icon: 'Radio', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.WIFI_ATTACKS, name: 'Aircrack-ng', description: 'Suite Manual Wifi', icon: 'Wifi', category: ModuleCategory.INITIAL_ACCESS },

  // 🚩 Post Exploitation
  { id: ModuleType.PRIV_ESC, name: 'LinPEAS / WinPEAS', description: 'Escalada de Privilegios', icon: 'Zap', category: ModuleCategory.POST_EXPLOITATION },
  { id: ModuleType.ACTIVE_DIRECTORY, name: 'Bloodhound / Impacket', description: 'Active Directory', icon: 'Server', category: ModuleCategory.POST_EXPLOITATION },
  { id: ModuleType.RUBEUS, name: 'Rubeus', description: 'Abuso de Kerberos: roasting, PtT, Golden/Silver Ticket', icon: 'Key', category: ModuleCategory.POST_EXPLOITATION },
  { id: ModuleType.CRACKMAPEXEC, name: 'CrackMapExec', description: 'NetExec / SMB Spray', icon: 'Server', category: ModuleCategory.POST_EXPLOITATION },
  { id: ModuleType.MIMIKATZ, name: 'Mimikatz', description: 'Credential Dumping', icon: 'Key', category: ModuleCategory.POST_EXPLOITATION },
  { id: ModuleType.PERSISTENCE, name: 'Persistencia', description: 'Backdoors / Tareas', icon: 'Shield', category: ModuleCategory.POST_EXPLOITATION },

  // 🔍 Análisis Forense & DFIR
  { id: ModuleType.FORENSICS_AUTOPSY, name: 'Autopsy', description: 'Análisis de Artefactos', icon: 'Fingerprint', category: ModuleCategory.FORENSICS },
  { id: ModuleType.FORENSICS_VOLATILITY, name: 'Volatility 3', description: 'Análisis en Memoria', icon: 'Cpu', category: ModuleCategory.FORENSICS },
  { id: ModuleType.FORENSICS_WIRESHARK, name: 'Wireshark', description: 'Análisis de PCAP', icon: 'Activity', category: ModuleCategory.FORENSICS },
  { id: ModuleType.FORENSICS_GHIDRA, name: 'Ghidra', description: 'Ingeniería inversa de binarios y análisis de malware', icon: 'Cpu', category: ModuleCategory.FORENSICS },

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

const loadFindingsFromStorage = (): BoardFinding[] => {
  try {
    const saved = localStorage.getItem('aegis_findings');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

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
  const [currentView, setCurrentView] = useState<'dashboard' | 'module' | 'links' | 'findings'>('dashboard');
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.RECON_NMAP);
  const [splitView, setSplitView] = useState(false);
  const [splitPaneModules, setSplitPaneModules] = useState<ModuleType[]>([ModuleType.RECON_NMAP, ModuleType.PRIV_ESC]);

  // Si el cifrado está activo, las sesiones/engagements viven cifrados en localStorage y
  // no se pueden leer de forma síncrona al montar (hace falta la passphrase primero) —
  // arrancan vacíos y se pueblan tras desbloquear el vault. Si no está activo, se cargan
  // igual que siempre.
  const [initState] = useState(() => (isEncryptionEnabled() ? { engagements: [], activeEngagementId: '', sessions: {} } : loadEngagementsAndSessions()));
  const [engagements, setEngagements] = useState<Engagement[]>(initState.engagements);
  const [activeEngagementId, setActiveEngagementId] = useState<string>(initState.activeEngagementId);
  const [sessionsData, setSessionsData] = useState<Record<string, Message[]>>(initState.sessions);
  const [findings, setFindings] = useState<BoardFinding[]>(() => (isEncryptionEnabled() ? [] : loadFindingsFromStorage()));
  const [engagementMenuOpen, setEngagementMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  const [newEngagementName, setNewEngagementName] = useState('');

  const [vaultKey, setVaultKey] = useState<CryptoKey | null>(null);
  const [vaultUnlocked, setVaultUnlocked] = useState(() => !isEncryptionEnabled());
  const [vaultPassphrase, setVaultPassphrase] = useState('');
  const [vaultError, setVaultError] = useState('');
  const [vaultBusy, setVaultBusy] = useState(false);
  const [newPassphrase, setNewPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [encryptionSetupError, setEncryptionSetupError] = useState('');
  const [encryptionEnabledFlag, setEncryptionEnabledFlag] = useState(isEncryptionEnabled);

  const persistSessionsData = async (data: Record<string, Message[]>, key: CryptoKey | null) => {
    const json = JSON.stringify(data);
    localStorage.setItem('aegis_sessions', key ? await encryptString(key, json) : json);
  };
  const persistEngagements = async (data: Engagement[], key: CryptoKey | null) => {
    const json = JSON.stringify(data);
    localStorage.setItem('aegis_engagements', key ? await encryptString(key, json) : json);
  };
  const persistFindings = async (data: BoardFinding[], key: CryptoKey | null) => {
    const json = JSON.stringify(data);
    localStorage.setItem('aegis_findings', key ? await encryptString(key, json) : json);
  };

  useEffect(() => {
    if (!vaultUnlocked) return;
    void persistSessionsData(sessionsData, vaultKey);
  }, [sessionsData, vaultUnlocked, vaultKey]);

  useEffect(() => {
    if (!vaultUnlocked) return;
    void persistEngagements(engagements, vaultKey);
  }, [engagements, vaultUnlocked, vaultKey]);

  useEffect(() => {
    if (!vaultUnlocked) return;
    void persistFindings(findings, vaultKey);
  }, [findings, vaultUnlocked, vaultKey]);

  useEffect(() => {
    if (!vaultUnlocked || !activeEngagementId) return;
    localStorage.setItem('aegis_active_engagement', activeEngagementId);
  }, [activeEngagementId, vaultUnlocked]);

  const handleUnlockVault = async (e: FormEvent) => {
    e.preventDefault();
    if (!vaultPassphrase) return;
    setVaultBusy(true);
    setVaultError('');
    try {
      const key = await unlockEncryption(vaultPassphrase);
      if (!key) {
        setVaultError('Passphrase incorrecta.');
        return;
      }
      const rawSessions = localStorage.getItem('aegis_sessions');
      const rawEngagements = localStorage.getItem('aegis_engagements');
      const rawFindings = localStorage.getItem('aegis_findings');
      let sessions: Record<string, Message[]> = {};
      let engs: Engagement[] = [];
      let finds: BoardFinding[] = [];
      if (rawSessions) {
        sessions = JSON.parse(await decryptString(key, rawSessions));
        Object.values(sessions).forEach((msgs) => msgs.forEach((m) => { m.timestamp = new Date(m.timestamp); }));
      }
      if (rawEngagements) {
        engs = JSON.parse(await decryptString(key, rawEngagements));
      }
      if (rawFindings) {
        finds = JSON.parse(await decryptString(key, rawFindings));
      }
      if (engs.length === 0) {
        engs = [{ id: uuidv4(), name: 'Engagement por defecto', createdAt: new Date().toISOString() }];
      }
      const savedActiveId = localStorage.getItem('aegis_active_engagement');
      const activeId = (savedActiveId && engs.some(x => x.id === savedActiveId)) ? savedActiveId : engs[0].id;

      setSessionsData(sessions);
      setEngagements(engs);
      setFindings(finds);
      setActiveEngagementId(activeId);
      setVaultKey(key);
      setVaultUnlocked(true);
      setVaultPassphrase('');
    } catch {
      setVaultError('No se pudo desbloquear. Verifica la passphrase.');
    } finally {
      setVaultBusy(false);
    }
  };

  const handleWipeVault = () => {
    if (!window.confirm('Esto borra PERMANENTEMENTE las sesiones y engagements cifrados de este navegador (no se puede deshacer). ¿Continuar?')) return;
    wipeEncryptedData();
    window.location.reload();
  };

  const handleEnableEncryption = async () => {
    if (newPassphrase.length < 8) { setEncryptionSetupError('Usa al menos 8 caracteres.'); return; }
    if (newPassphrase !== confirmPassphrase) { setEncryptionSetupError('Las passphrases no coinciden.'); return; }
    setEncryptionSetupError('');
    const key = await setupEncryption(newPassphrase);
    await persistSessionsData(sessionsData, key);
    await persistEngagements(engagements, key);
    await persistFindings(findings, key);
    setVaultKey(key);
    setEncryptionEnabledFlag(true);
    setNewPassphrase('');
    setConfirmPassphrase('');
  };

  const handleDisableEncryption = async () => {
    if (!window.confirm('Esto descifra tus datos y los deja en texto plano en este navegador. ¿Continuar?')) return;
    await persistSessionsData(sessionsData, null);
    await persistEngagements(engagements, null);
    await persistFindings(findings, null);
    disableEncryption();
    setVaultKey(null);
    setEncryptionEnabledFlag(false);
  };

  // Loading por sesión (engagement+módulo), no global — así una terminal puede seguir
  // esperando respuesta de la IA mientras el operador trabaja en otro panel de la vista
  // dividida sin que el input de ese otro panel se bloquee.
  const [loadingKeys, setLoadingKeys] = useState<Record<string, boolean>>({});
  const setKeyLoading = (key: string, val: boolean) => setLoadingKeys(prev => ({ ...prev, [key]: val }));
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
    const key = sessionKey(engagementId, module);
    setKeyLoading(key, true);
    try {
      const reply = await initializeChat(module, aiProvider, language);
      addMessage(engagementId, module, reply, 'model');
    } catch (e) {
      addMessage(engagementId, module, `Error crítico: Fallo en inicialización de IA (${aiProvider === 'gemini' ? 'Gemini' : 'Ollama Local'}). Verifica el motor en OPSEC & SYSTEM.`, 'system');
    } finally {
      setKeyLoading(key, false);
    }
  };

  const ensureSessionStarted = (engagementId: string, module: ModuleType) => {
    const key = sessionKey(engagementId, module);
    if (!sessionsData[key] || sessionsData[key].length === 0) {
      void runInitFlow(engagementId, module);
    }
  };

  const handleModuleSelect = (module: ModuleType) => {
    setActiveModule(module);
    setCurrentView('module');
    ensureSessionStarted(activeEngagementId, module);
  };

  const sendMessageForModule = async (module: ModuleType, text: string) => {
    const currentEng = activeEngagementId;
    const key = sessionKey(currentEng, module);
    const history = toChatHistory(sessionsData[key] || []);
    addMessage(currentEng, module, text, 'user');
    setKeyLoading(key, true);
    try {
      const response = await sendMessage(module, aiProvider, language, history, text);
      addMessage(currentEng, module, response, 'model');
    } catch (e) {
      addMessage(currentEng, module, "Error de conexión con el núcleo de IA.", 'system');
    } finally {
      setKeyLoading(key, false);
    }
  };
  const handleUserMessage = (text: string) => { void sendMessageForModule(activeModule, text); };

  const generateReportForModule = async (module: ModuleType) => {
    const currentEng = activeEngagementId;
    const key = sessionKey(currentEng, module);
    setKeyLoading(key, true);
    addMessage(currentEng, module, "Iniciando compilación de evidencias...", 'system');
    try {
        const history = toChatHistory(sessionsData[key] || []);
        const report = await generateReportData(module, aiProvider, language, history, userProfile?.name || 'Unknown');
        if (report) {
            setReportData(report);
            setIsReportModalOpen(true);
            addMessage(currentEng, module, "Reporte generado exitosamente.", 'system');
        } else {
            addMessage(currentEng, module, "Error generando reporte: La IA no devolvió datos estructurados válidos.", 'system');
        }
    } catch (e) {
        addMessage(currentEng, module, "Error crítico al generar reporte.", 'system');
    } finally {
        setKeyLoading(key, false);
    }
  };
  const handleGenerateReport = () => { void generateReportForModule(activeModule); };

  const clearSessionForModule = async (module: ModuleType) => {
    const key = sessionKey(activeEngagementId, module);
    setSessionsData(prev => ({ ...prev, [key]: [] }));
    await runInitFlow(activeEngagementId, module);
  };
  const handleClearSession = () => { void clearSessionForModule(activeModule); };

  const activeEngagement = engagements.find(e => e.id === activeEngagementId);

  const handleSwitchEngagement = (id: string) => {
    setActiveEngagementId(id);
    setEngagementMenuOpen(false);
    if (currentView !== 'module') return;
    if (splitView) {
      splitPaneModules.forEach(m => ensureSessionStarted(id, m));
    } else {
      ensureSessionStarted(id, activeModule);
    }
  };

  const handleEnterSplitView = () => {
    setSplitView(true);
    splitPaneModules.forEach(m => ensureSessionStarted(activeEngagementId, m));
  };

  const handleExitSplitView = () => setSplitView(false);

  const handleChangePaneModule = (paneIndex: number, module: ModuleType) => {
    setSplitPaneModules(prev => prev.map((m, i) => i === paneIndex ? module : m));
    ensureSessionStarted(activeEngagementId, module);
  };

  const handleAddPane = () => {
    if (splitPaneModules.length >= 3) return;
    const unused = TOOLS_CONFIG.map(t => t.id).find(id => !splitPaneModules.includes(id)) || ModuleType.RECON_NMAP;
    setSplitPaneModules(prev => [...prev, unused]);
    ensureSessionStarted(activeEngagementId, unused);
  };

  const handleRemovePane = (index: number) => {
    if (splitPaneModules.length <= 2) {
      setSplitView(false);
      return;
    }
    setSplitPaneModules(prev => prev.filter((_, i) => i !== index));
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
    setFindings(prev => prev.filter(f => f.engagementId !== id));
    if (activeEngagementId === id) {
      const remaining = engagements.filter(e => e.id !== id);
      setActiveEngagementId(remaining[0]?.id ?? '');
    }
  };

  const handleOpenSearchResult = (engagementId: string, module: ModuleType) => {
    setActiveEngagementId(engagementId);
    setActiveModule(module);
    setSplitView(false);
    setCurrentView('module');
    setSearchOpen(false);
  };

  const handleExportEngagement = (id: string) => {
    const eng = engagements.find(e => e.id === id);
    if (!eng) return;
    const sessions: Record<string, Message[]> = {};
    Object.entries(sessionsData).forEach(([key, msgs]) => {
      if (key.startsWith(`${id}::`)) sessions[key] = msgs;
    });
    const engFindings = findings.filter(f => f.engagementId === id);
    const bundle = {
      version: 1,
      exportedAt: new Date().toISOString(),
      engagement: eng,
      sessions,
      findings: engFindings,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEGIS_ENGAGEMENT_${eng.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportEngagementFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const bundle = JSON.parse(reader.result as string) as {
          engagement: Engagement;
          sessions: Record<string, Message[]>;
          findings: BoardFinding[];
        };
        if (!bundle.engagement?.name || !bundle.sessions || !bundle.findings) {
          throw new Error('invalid shape');
        }
        const newId = uuidv4();
        const newEngagement: Engagement = { ...bundle.engagement, id: newId, name: `${bundle.engagement.name} (importado)` };
        const remappedSessions: Record<string, Message[]> = {};
        Object.entries(bundle.sessions).forEach(([key, msgs]) => {
          const moduleId = key.split('::')[1] || key;
          remappedSessions[sessionKey(newId, moduleId)] = msgs.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
        });
        const remappedFindings: BoardFinding[] = bundle.findings.map(f => ({ ...f, id: uuidv4(), engagementId: newId }));

        setEngagements(prev => [...prev, newEngagement]);
        setSessionsData(prev => ({ ...prev, ...remappedSessions }));
        setFindings(prev => [...prev, ...remappedFindings]);
        setActiveEngagementId(newId);
        setEngagementMenuOpen(false);
      } catch {
        window.alert('El archivo no es un export válido de un engagement de AEGIS.');
      }
    };
    reader.readAsText(file);
  };

  const handleAddFinding = (title: string, severity: Severity) => {
    const newFinding: BoardFinding = { id: uuidv4(), engagementId: activeEngagementId, title, severity, status: 'found', createdAt: new Date().toISOString() };
    setFindings(prev => [...prev, newFinding]);
  };

  const handleMoveFinding = (id: string, status: FindingStatus) => {
    setFindings(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const handleDeleteFinding = (id: string) => {
    setFindings(prev => prev.filter(f => f.id !== id));
  };

  const handleUpdateFinding = (id: string, updates: Partial<Pick<BoardFinding, 'description' | 'remediation'>>) => {
    setFindings(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  // Arma el reporte directo desde los hallazgos ya marcados "Reportado" en el tablero,
  // sin volver a llamar a la IA — cierra el loop encontrar → trackear → reportar en vez
  // de que el reporte tenga que re-inferir todo releyendo la conversación desde cero.
  const handleGenerateReportFromFindings = () => {
    const reported = findings.filter(f => f.engagementId === activeEngagementId && f.status === 'reported');
    if (reported.length === 0) {
      window.alert('No hay hallazgos en la columna "Reportado" todavía. Mueve al menos uno antes de generar el reporte.');
      return;
    }
    const report: AuditReport = {
      title: `Informe de Hallazgos — ${activeEngagement?.name || 'Engagement'}`,
      target: activeEngagement?.target || activeEngagement?.name || 'N/A',
      date: new Date().toLocaleDateString(),
      auditor: userProfile?.name || 'Unknown',
      executiveSummary: `Este informe documenta ${reported.length} hallazgo(s) identificados y verificados durante el engagement "${activeEngagement?.name}".`,
      findings: reported.map(f => ({
        severity: f.severity,
        title: f.title,
        description: f.description?.trim() || 'Pendiente de documentar la descripción técnica de este hallazgo.',
        remediation: f.remediation?.trim() || 'Pendiente de documentar la remediación recomendada.',
      })),
      conclusion: 'Se recomienda remediar los hallazgos listados según su severidad y realizar una reauditoría de verificación tras la corrección.',
    };
    setReportData(report);
    setIsReportModalOpen(true);
  };

  const activeToolObj = TOOLS_CONFIG.find(t => t.id === activeModule);
  const activeToolName = activeToolObj ? activeToolObj.name.toUpperCase() : activeModule;

  const currentMessages = sessionsData[sessionKey(activeEngagementId, activeModule)] || [];
  const currentIsLoading = !!loadingKeys[sessionKey(activeEngagementId, activeModule)];

  if (!vaultUnlocked) {
    return (
      <div className="h-screen w-full bg-[#0a0a0c] flex items-center justify-center relative overflow-hidden">
        <TacticalOverlay />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#f43f5e_0%,transparent_50%)]"></div>
        <div className="z-10 bg-surface border border-gray-800 p-8 rounded-sm shadow-2xl w-full max-w-md text-center">
            <Lock size={40} className="mx-auto mb-4 text-rose-500" />
            <h1 className="text-2xl font-bold text-white mb-2">ALMACENAMIENTO CIFRADO</h1>
            <h2 className="text-sm text-rose-500 tracking-[0.3em] mb-8">INGRESA TU PASSPHRASE</h2>
            <form onSubmit={handleUnlockVault} className="space-y-4">
                <input
                    type="password"
                    value={vaultPassphrase}
                    onChange={(e) => setVaultPassphrase(e.target.value)}
                    placeholder="Passphrase..."
                    title="Passphrase de cifrado"
                    className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded-lg focus:border-rose-500 focus:outline-none transition-colors"
                    autoFocus
                />
                {vaultError && <p className="text-red-500 text-xs">{vaultError}</p>}
                <button type="submit" disabled={vaultBusy} className="w-full bg-gradient-to-r from-slate-700 to-rose-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                    {vaultBusy ? 'DESCIFRANDO...' : 'DESBLOQUEAR'}
                </button>
            </form>
            <button onClick={handleWipeVault} className="mt-6 text-[11px] text-gray-600 hover:text-red-500 transition-colors underline">
                ¿Olvidaste tu passphrase? Borrar datos cifrados
            </button>
        </div>
      </div>
    );
  }

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
      {searchOpen && (
        <GlobalSearchModal
          sessionsData={sessionsData}
          engagements={engagements}
          toolsConfig={TOOLS_CONFIG}
          onOpenResult={handleOpenSearchResult}
          onClose={() => setSearchOpen(false)}
        />
      )}
      {settingsOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-gray-700 rounded-lg w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 z-10 bg-surface p-6 pb-4 border-b border-gray-800">
                <button onClick={() => setSettingsOpen(false)} title="Cerrar panel" aria-label="Cerrar panel" className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X /></button>
                <h2 className="text-xl font-bold flex items-center gap-2 text-rose-500">
                    <Settings size={20} /> OPSEC & SYSTEM
                </h2>
            </div>

            <div className="space-y-6 p-6 pt-4">
                {/* 1. System Status */}
                <div className="bg-[#0a0a0c] border border-gray-800 p-4 rounded-lg shadow-inner">
                    <h3 className="text-[10px] text-gray-500 font-bold tracking-widest mb-3 uppercase">Conectividad del C2</h3>
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-300 font-medium">☁️ Gemini 3.7 (Cloud)</span>
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
                            <span className="text-[9px] font-normal opacity-70">Gemini 3.7</span>
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

                {/* 5. Local Storage Encryption */}
                <div className="bg-[#0a0a0c] border border-gray-800 p-4 rounded-lg shadow-inner">
                    <h3 className="text-[10px] text-gray-500 font-bold tracking-widest mb-3 uppercase flex items-center gap-2"><Lock size={12} /> Cifrado del Almacenamiento Local</h3>
                    {encryptionEnabledFlag ? (
                        <>
                            <p className="text-xs text-green-500 flex items-center gap-2 mb-3"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Cifrado activo — sesiones y engagements protegidos con tu passphrase.</p>
                            <button
                                onClick={() => void handleDisableEncryption()}
                                className="w-full py-2 bg-gray-800/50 hover:bg-gray-700/60 text-gray-300 border border-gray-700 rounded transition-colors text-xs font-bold"
                            >
                                DESACTIVAR CIFRADO
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-[10px] text-gray-500 mb-3">Protege el historial de sesiones y los engagements con una passphrase (AES-256, derivada vía PBKDF2). Si la olvidas, esos datos son irrecuperables — no hay forma de restaurarlos.</p>
                            <input
                                type="password"
                                value={newPassphrase}
                                onChange={(e) => setNewPassphrase(e.target.value)}
                                placeholder="Nueva passphrase (mín. 8 caracteres)"
                                title="Nueva passphrase de cifrado"
                                className="w-full bg-black/50 border border-gray-700 text-white text-xs p-2 rounded mb-2 focus:border-rose-500 focus:outline-none"
                            />
                            <input
                                type="password"
                                value={confirmPassphrase}
                                onChange={(e) => setConfirmPassphrase(e.target.value)}
                                placeholder="Confirma la passphrase"
                                title="Confirmar passphrase de cifrado"
                                className="w-full bg-black/50 border border-gray-700 text-white text-xs p-2 rounded mb-2 focus:border-rose-500 focus:outline-none"
                            />
                            {encryptionSetupError && <p className="text-red-500 text-[10px] mb-2">{encryptionSetupError}</p>}
                            <button
                                onClick={() => void handleEnableEncryption()}
                                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors text-xs font-bold"
                            >
                                ACTIVAR CIFRADO
                            </button>
                        </>
                    )}
                </div>

                {/* 6. Panic Button */}
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
                  <button onClick={() => handleExportEngagement(eng.id)} title="Exportar este engagement como JSON (backup)" aria-label="Exportar engagement" className="text-gray-600 hover:text-terminal shrink-0"><Download size={12} /></button>
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
              <div className="pt-1">
                <label
                  title="Importar un engagement desde un archivo JSON exportado previamente"
                  className="w-full flex items-center justify-center gap-2 px-2 py-1.5 bg-gray-800/50 hover:bg-terminal/20 text-gray-400 hover:text-terminal border border-gray-700 hover:border-terminal/50 rounded text-xs cursor-pointer transition-colors"
                >
                  <Upload size={12} /> Importar engagement (JSON)
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) handleImportEngagementFile(e.target.files[0]); e.target.value = ''; }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-2 mt-2 space-y-1">
          <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-rose-500/20 text-white border border-rose-500/50' : 'text-gray-400 hover:bg-white/5'}`}><Home size={18} /><span className="font-bold text-sm">DASHBOARD</span></button>
          <button onClick={() => setCurrentView('links')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'links' ? 'bg-rose-500/20 text-white border border-rose-500/50' : 'text-gray-400 hover:bg-white/5'}`}><Link2 size={18} /><span className="font-bold text-sm">RECURSOS & OSINT</span></button>
          <button onClick={() => setCurrentView('findings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'findings' ? 'bg-rose-500/20 text-white border border-rose-500/50' : 'text-gray-400 hover:bg-white/5'}`}><Kanban size={18} /><span className="font-bold text-sm">HALLAZGOS</span></button>
          <button onClick={() => setSearchOpen(true)} className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors text-gray-400 hover:bg-white/5">
            <span className="flex items-center gap-3"><Search size={18} /><span className="font-bold text-sm">BUSCAR</span></span>
            <span className="text-[9px] font-mono text-gray-600 border border-gray-700 rounded px-1.5 py-0.5">CTRL+K</span>
          </button>
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
        {currentView === 'findings' && (
          <FindingsBoard
            findings={findings.filter(f => f.engagementId === activeEngagementId)}
            onAdd={handleAddFinding}
            onMove={handleMoveFinding}
            onDelete={handleDeleteFinding}
            onUpdate={handleUpdateFinding}
            onGenerateReport={handleGenerateReportFromFindings}
          />
        )}
        {currentView === 'module' && !splitView && (
          <Terminal
            messages={currentMessages}
            onSendMessage={handleUserMessage}
            onGenerateReport={handleGenerateReport}
            onClearSession={handleClearSession}
            onEnterSplitView={handleEnterSplitView}
            isLoading={currentIsLoading}
            activeModule={activeModule}
            activeModuleName={activeToolName}
            activeProvider={aiProvider}
          />
        )}
        {currentView === 'module' && splitView && (
          <SplitTerminalView
            paneModules={splitPaneModules}
            toolsConfig={TOOLS_CONFIG}
            sessionsData={sessionsData}
            loadingKeys={loadingKeys}
            activeEngagementId={activeEngagementId}
            activeProvider={aiProvider}
            onChangePaneModule={handleChangePaneModule}
            onSendMessage={sendMessageForModule}
            onGenerateReport={generateReportForModule}
            onClearSession={clearSessionForModule}
            onAddPane={handleAddPane}
            onRemovePane={handleRemovePane}
            onExit={handleExitSplitView}
          />
        )}
      </main>
    </div>
  );
};
export default App;
