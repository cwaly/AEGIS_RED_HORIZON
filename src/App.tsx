import { useState, useEffect, FC, FormEvent } from 'react';
import { ModuleType, Message, Tool, ModuleCategory, ApiKeys, UserProfile, Language, AuditReport } from './types';
import { initializeChat, sendMessage, resetSession, generateReportData, checkApiKeyAvailability } from './services/geminiService';
import { Terminal } from './components/Terminal';
import { Logo } from './components/Logo';
import { ReportModal } from './components/ReportModal';
import { 
  Terminal as TerminalIcon, 
  Settings, 
  FileText, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Shield, 
  Wifi, 
  Globe, 
  Database, 
  Lock, 
  Server, 
  Eye, 
  Zap, 
  Cpu, 
  Home, 
  LogOut, 
  Bug,
  Smartphone,
  Cloud,
  AlertOctagon
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const TOOLS_CONFIG: Tool[] = [
  { id: ModuleType.NMAP, name: 'Nmap / Masscan', description: 'Mapeo de Red', icon: 'TerminalIcon', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.SHODAN, name: 'Shodan API', description: 'Intel de Internet', icon: 'Globe', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.OSINT_GENERAL, name: 'OSINT Suite', description: 'TheHarvester / Maltego', icon: 'Eye', category: ModuleCategory.INTELLIGENCE },
  { id: ModuleType.WIRESHARK, name: 'Sniffing', description: 'Wireshark / Ettercap', icon: 'Wifi', category: ModuleCategory.INTELLIGENCE },
  
  { id: ModuleType.BUG_BOUNTY_RECON, name: 'Recon Masivo', description: 'Subfinder / Amass', icon: 'Globe', category: ModuleCategory.BUG_BOUNTY },
  { id: ModuleType.BUG_BOUNTY_VULN, name: 'Vuln Scanning', description: 'Nuclei / Jaeger', icon: 'Bug', category: ModuleCategory.BUG_BOUNTY },

  { id: ModuleType.CLOUD_AWS, name: 'AWS Audit', description: 'Pacu / ScoutSuite', icon: 'Cloud', category: ModuleCategory.CLOUD_SECURITY },
  { id: ModuleType.CLOUD_AZURE, name: 'Azure Audit', description: 'AzureHound / RoadTools', icon: 'Cloud', category: ModuleCategory.CLOUD_SECURITY },

  { id: ModuleType.MOBILE_STATIC, name: 'Static Analysis', description: 'MobSF / Jadx', icon: 'Smartphone', category: ModuleCategory.MOBILE_HACKING },
  { id: ModuleType.MOBILE_DYNAMIC, name: 'Dynamic Hook', description: 'Frida / Objection', icon: 'Smartphone', category: ModuleCategory.MOBILE_HACKING },

  { id: ModuleType.PAYLOAD_GEN, name: 'Payloads', description: 'MSFVenom / Veil', icon: 'Zap', category: ModuleCategory.WEAPONIZATION },
  { id: ModuleType.PHISHING_PREP, name: 'Phishing Ops', description: 'GoPhish / SET', icon: 'Users', category: ModuleCategory.WEAPONIZATION },
  
  { id: ModuleType.BURP_CAIDO, name: 'Burp / Caido', description: 'Proxies de Intercepción', icon: 'Globe', category: ModuleCategory.WEB_HACKING },
  { id: ModuleType.SQLMAP, name: 'SQL Injection', description: 'SQLMap Auto', icon: 'Database', category: ModuleCategory.WEB_HACKING },
  { id: ModuleType.WPSCAN, name: 'CMS Audit', description: 'WPScan / JoomScan', icon: 'FileText', category: ModuleCategory.WEB_HACKING },
  { id: ModuleType.OWASP_ZAP, name: 'Web Scanner', description: 'OWASP ZAP', icon: 'Shield', category: ModuleCategory.WEB_HACKING },
  
  { id: ModuleType.METASPLOIT, name: 'Metasploit Fwk', description: 'Exploitation Core', icon: 'TerminalIcon', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.HYDRA_HASHCAT, name: 'Cracking', description: 'Hydra / Hashcat', icon: 'Lock', category: ModuleCategory.INITIAL_ACCESS },
  { id: ModuleType.WIFI_ATTACKS, name: 'Wireless', description: 'Aircrack-ng Suite', icon: 'Wifi', category: ModuleCategory.INITIAL_ACCESS },
  
  { id: ModuleType.PRIV_ESC, name: 'PrivEsc', description: 'LinPEAS / WinPEAS', icon: 'Zap', category: ModuleCategory.POST_EXPLOITATION },
  { id: ModuleType.ACTIVE_DIRECTORY, name: 'Active Directory', description: 'Bloodhound / Impacket', icon: 'Server', category: ModuleCategory.POST_EXPLOITATION },
  { id: ModuleType.PERSISTENCE, name: 'Persistencia', description: 'Backdoors / C2', icon: 'Ghost', category: ModuleCategory.POST_EXPLOITATION },
  
  { id: ModuleType.REPORT_GENERATOR, name: 'Report Builder', description: 'Generar Informe Final', icon: 'FileText', category: ModuleCategory.REPORTING },
];

const App: FC = () => {
  // --- STATE INIT ---
  const [systemReady, setSystemReady] = useState<boolean>(true); // Nuevo estado para verificar .env

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('aura_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    const saved = localStorage.getItem('aura_api_keys');
    return saved ? JSON.parse(saved) : { shodan: '', virusTotal: '', wpscan: '', openai: '' };
  });

  const [loginName, setLoginName] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'module'>('dashboard');
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.NMAP);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<AuditReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('es');
  
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    [ModuleCategory.INTELLIGENCE]: true,
    [ModuleCategory.BUG_BOUNTY]: false,
    [ModuleCategory.CLOUD_SECURITY]: false,
    [ModuleCategory.MOBILE_HACKING]: false,
    [ModuleCategory.WEAPONIZATION]: false,
    [ModuleCategory.WEB_HACKING]: false,
    [ModuleCategory.INITIAL_ACCESS]: false,
    [ModuleCategory.POST_EXPLOITATION]: false,
    [ModuleCategory.REPORTING]: true,
  });

  // Check API Key on Mount
  useEffect(() => {
    const isReady = checkApiKeyAvailability();
    setSystemReady(isReady);
  }, []);

  // Persist Profile changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('aura_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('aura_user_profile');
    }
  }, [userProfile]);

  // Persist API Key changes
  useEffect(() => {
    localStorage.setItem('aura_api_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);


  const toggleCategory = (cat: string) => setExpandedCategories(prev => ({...prev, [cat]: !prev[cat]}));
  const getIcon = (iconName: string) => {
    const icons: any = { TerminalIcon, Globe, Eye, Wifi, Zap, Users: Shield, Database, FileText, Shield, Lock, Server, Ghost: Shield, Cpu, Bug, Smartphone, Cloud };
    const Icon = icons[iconName] || TerminalIcon;
    return <Icon size={18} />;
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) return;
    
    // Improved Initials Logic
    const cleanName = loginName.trim().replace(/\s+/g, ' ');
    const parts = cleanName.split(' ');
    let initials = parts[0][0];
    if (parts.length > 1) {
        initials += parts[parts.length - 1][0];
    } else if (cleanName.length > 1) {
        initials += cleanName[1];
    }
    
    setUserProfile({ name: cleanName, initials: initials.toUpperCase(), role: 'Senior Auditor' });
  };

  const handleModuleSelect = async (module: ModuleType) => {
    setActiveModule(module);
    setCurrentView('module');
    setMessages([]);
    setIsLoading(true);
    try {
      resetSession();
      await initializeChat(module, apiKeys, language);
      let initialPrompt = language === 'es' ? `Inicializando módulo ${module}. ¿Target?` : `Initializing module ${module}. Target?`;
      const response = await sendMessage(initialPrompt);
      addMessage(response, 'model');
    } catch (e) {
      addMessage("Error crítico: Fallo en inicialización de IA. Verifique su API Key en .env", 'system');
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (content: string, role: 'user' | 'model' | 'system') => {
    setMessages(prev => [...prev, { id: uuidv4(), role, content, timestamp: new Date() }]);
  };

  const handleUserMessage = async (text: string) => {
    addMessage(text, 'user');
    setIsLoading(true);
    try {
      const response = await sendMessage(text);
      addMessage(response, 'model');
    } catch (e) {
      addMessage("Error de conexión con el núcleo de IA.", 'system');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    addMessage("Iniciando compilación de evidencias...", 'system');
    try {
        const report = await generateReportData(activeModule, userProfile?.name || 'Unknown');
        if (report) {
            setReportData(report);
            setIsReportModalOpen(true);
            addMessage("Reporte generado exitosamente.", 'system');
        } else {
            addMessage("Error generando reporte: La IA no devolvió datos estructurados válidos.", 'system');
        }
    } catch (e) {
        addMessage("Error crítico al generar reporte.", 'system');
    } finally {
        setIsLoading(false);
    }
  };

  // --- SYSTEM HALTED SCREEN (Si falta la key) ---
  if (!systemReady) {
    return (
      <div className="h-screen w-full bg-[#0a0000] flex items-center justify-center relative overflow-hidden font-mono text-red-500">
        <div className="z-10 bg-black border border-red-900 p-8 rounded-lg shadow-[0_0_50px_rgba(255,0,0,0.3)] max-w-lg text-center">
            <AlertOctagon size={64} className="mx-auto mb-6 text-red-600 animate-pulse" />
            <h1 className="text-3xl font-bold mb-2">SYSTEM HALTED</h1>
            <h2 className="text-sm tracking-[0.5em] mb-8 text-red-800">SECURITY PROTOCOL ENGAGED</h2>
            
            <div className="text-left bg-red-900/10 p-4 rounded border border-red-900/30 text-xs mb-6 space-y-2">
                <p>CRITICAL ERROR: API Key Missing.</p>
                <p>The system cannot initialize the Neural Core without a valid access token.</p>
                <br/>
                <p className="font-bold text-red-400">INSTRUCTIONS:</p>
                <ol className="list-decimal pl-4 space-y-1 text-gray-400">
                    <li>Create a file named <span className="text-white">.env</span> in the root folder.</li>
                    <li>Add your key: <span className="text-white">VITE_GEMINI_API_KEY=AIzaSy...</span></li>
                    <li>Restart the terminal: <span className="text-white">Ctrl+C</span> then <span className="text-white">npm run dev</span></li>
                </ol>
            </div>
            <button onClick={() => window.location.reload()} className="bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900 px-6 py-2 rounded transition-colors uppercase text-xs tracking-widest">
                Re-Scan System
            </button>
        </div>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!userProfile) {
    return (
      <div className="h-screen w-full bg-[#0a0a0c] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ef4444 0%, transparent 50%)' }}></div>
        <div className="z-10 bg-surface border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
            <Logo className="w-24 h-24 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">AURA OPS</h1>
            <h2 className="text-sm text-primary tracking-[0.4em] mb-8">RED HORIZON ACCESS</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Enter your name..." className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded-lg focus:border-primary focus:outline-none transition-colors" autoFocus />
                <button type="submit" className="w-full bg-gradient-to-r from-secondary to-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">AUTHENTICATE</button>
            </form>
            <div className="mt-8 text-xs text-gray-600">Created by César Matute</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background text-gray-200 overflow-hidden font-sans">
      {isReportModalOpen && reportData && (<ReportModal report={reportData} onClose={() => setIsReportModalOpen(false)} />)}
      {settingsOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-gray-700 p-6 rounded-lg w-full max-w-md shadow-2xl relative">
            <button onClick={() => setSettingsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary"><Settings size={20} /> System Configuration</h2>
            <div className="mb-6">
                <label className="block text-xs uppercase text-gray-500 mb-2">Language</label>
                <div className="flex bg-black/50 rounded p-1 border border-gray-700">
                    <button onClick={() => setLanguage('es')} className={`flex-1 py-1 text-sm rounded ${language === 'es' ? 'bg-primary text-white' : 'text-gray-400'}`}>Español</button>
                    <button onClick={() => setLanguage('en')} className={`flex-1 py-1 text-sm rounded ${language === 'en' ? 'bg-primary text-white' : 'text-gray-400'}`}>English</button>
                </div>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div><label className="block text-xs uppercase text-gray-500 mb-1">Shodan API Key</label><input type="password" className="w-full bg-black/50 border border-gray-700 p-2 rounded text-sm" value={apiKeys.shodan || ''} onChange={(e) => setApiKeys({...apiKeys, shodan: e.target.value})} /></div>
              <div><label className="block text-xs uppercase text-gray-500 mb-1">VirusTotal API Key</label><input type="password" className="w-full bg-black/50 border border-gray-700 p-2 rounded text-sm" value={apiKeys.virusTotal || ''} onChange={(e) => setApiKeys({...apiKeys, virusTotal: e.target.value})} /></div>
              <div><label className="block text-xs uppercase text-gray-500 mb-1">WPScan API Token</label><input type="password" className="w-full bg-black/50 border border-gray-700 p-2 rounded text-sm" value={apiKeys.wpscan || ''} onChange={(e) => setApiKeys({...apiKeys, wpscan: e.target.value})} /></div>
            </div>
            <div className="mt-6"><button onClick={() => setSettingsOpen(false)} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded transition-colors">Save & Close</button></div>
          </div>
        </div>
      )}
      <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-surface border border-gray-700 rounded-md shadow-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <X /> : <Menu />}</button>
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform fixed md:relative z-40 w-72 h-full bg-surface border-r border-gray-800 flex flex-col shadow-2xl`}>
        <div className="p-6 border-b border-gray-800 flex flex-col items-center relative">
          <button onClick={() => setSettingsOpen(true)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><Settings size={16} /></button>
          <Logo className="w-14 h-14 mb-3" />
          <h1 className="text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary text-center">AURA OPS<br/><span className="text-xs tracking-[0.3em] text-gray-500">RED HORIZON</span></h1>
        </div>
        <div className="px-4 py-2 mt-2"><button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-primary/20 text-white border border-primary/50' : 'text-gray-400 hover:bg-white/5'}`}><Home size={18} /><span className="font-bold text-sm">DASHBOARD</span></button></div>
        <nav className="flex-1 overflow-y-auto py-2 px-0 space-y-0 custom-scrollbar">
          {Object.values(ModuleCategory).map((category) => (
            <div key={category} className="border-b border-gray-800/50">
              <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"><span>{category}</span>{expandedCategories[category] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
              {expandedCategories[category] && (
                <div className="bg-[#0f0f13] pb-2">
                  {TOOLS_CONFIG.filter(t => t.category === category).map(tool => (
                    <button key={tool.id} onClick={() => { handleModuleSelect(tool.id); if (window.innerWidth < 768) setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-6 py-2 text-sm border-l-2 transition-all duration-200 ${activeModule === tool.id && currentView === 'module' ? 'border-primary bg-primary/10 text-white' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}><span className={activeModule === tool.id && currentView === 'module' ? 'text-primary' : ''}>{getIcon(tool.icon)}</span><div className="text-left"><div className="font-medium leading-none mb-1">{tool.name}</div></div></button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="p-4 bg-[#08080a] border-t border-gray-800 flex items-center gap-3">
           <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">{userProfile.initials}</div>
           <div className="flex-1 overflow-hidden"><div className="text-sm font-bold text-white truncate">{userProfile.name}</div><div className="text-xs text-primary truncate">{userProfile.role}</div></div>
           <button onClick={() => { setUserProfile(null); localStorage.removeItem('aura_user_profile'); }} className="text-gray-500 hover:text-red-500 transition-colors"><LogOut size={16} /></button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col relative h-full bg-[#0a0a0c]">
        {currentView === 'dashboard' && (
            <div className="h-full overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 flex justify-between items-end">
                        <div><h2 className="text-3xl font-bold text-white mb-2">Command Center</h2><p className="text-gray-400">Welcome back, {userProfile.name}. System ready.</p></div>
                        <div className="flex gap-4 text-xs font-mono text-gray-500"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> ONLINE</span></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {TOOLS_CONFIG.map(tool => (
                            <button key={tool.id} onClick={() => handleModuleSelect(tool.id)} className="bg-surface border border-gray-800 p-6 rounded-xl hover:border-primary/50 hover:bg-surface/80 transition-all group text-left">
                                <div className="flex items-start justify-between mb-4"><div className="p-3 rounded-lg bg-gray-900 text-primary group-hover:scale-110 transition-transform">{getIcon(tool.icon)}</div><span className="text-[10px] uppercase font-bold text-gray-600 bg-black/30 px-2 py-1 rounded">{tool.category.split('&')[0]}</span></div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{tool.name}</h3>
                                <p className="text-sm text-gray-500">{tool.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
        {currentView === 'module' && (<Terminal messages={messages} onSendMessage={handleUserMessage} onGenerateReport={handleGenerateReport} isLoading={isLoading} activeModule={activeModule} />)}
      </main>
    </div>
  );
};
export default App;