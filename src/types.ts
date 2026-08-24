export enum ModuleCategory {
  METHODOLOGY = 'METODOLOGÍA & PLAYBOOKS (OSCP/eJPT)',
  INTELLIGENCE = 'INTELIGENCIA & OSINT',
  VULN_RESEARCH = 'INVESTIGACIÓN DE VULN & CTI', // <--- NUEVA CATEGORÍA
  BUG_BOUNTY = 'RECON & BUG BOUNTY',
  CLOUD_SECURITY = 'CLOUD SECURITY (AWS/AZURE)',
  MOBILE_HACKING = 'MOBILE & APPS (ANDROID/iOS)',
  WEAPONIZATION = 'DESARROLLO DE RECURSOS & C2',
  WEB_HACKING = 'ATAQUES WEB & API',
  INITIAL_ACCESS = 'ACCESO INICIAL',
  POST_EXPLOITATION = 'POST-EXPLOTACIÓN & LATERAL',
  FORENSICS = 'ANÁLISIS FORENSE & DFIR',
  REPORTING = 'REPORTING & EVIDENCIA'
}

export enum ModuleType {
  // Metodología & Playbooks (guías end-to-end alineadas a certificaciones)
  PLAYBOOK_AD_ATTACK_PATH = 'PLAYBOOK_AD_ATTACK_PATH',
  PLAYBOOK_PIVOTING = 'PLAYBOOK_PIVOTING',
  PLAYBOOK_WEB_API = 'PLAYBOOK_WEB_API',
  PLAYBOOK_PRIVESC = 'PLAYBOOK_PRIVESC',
  PLAYBOOK_BUFFER_OVERFLOW = 'PLAYBOOK_BUFFER_OVERFLOW',
  PLAYBOOK_REDTEAM_C2 = 'PLAYBOOK_REDTEAM_C2',
  PLAYBOOK_MOBILE = 'PLAYBOOK_MOBILE',
  PLAYBOOK_CLOUD = 'PLAYBOOK_CLOUD',
  PLAYBOOK_WIRELESS = 'PLAYBOOK_WIRELESS',
  PLAYBOOK_OSINT_RECON = 'PLAYBOOK_OSINT_RECON',
  PLAYBOOK_REPORT_WRITING = 'PLAYBOOK_REPORT_WRITING',

  // Intelligence & OSINT
  OSINT_SHERLOCK = 'OSINT_SHERLOCK',
  OSINT_MALTEGO = 'OSINT_MALTEGO',
  OSINT_RECON_NG = 'OSINT_RECON_NG',
  CIBER_INTEL_MISP = 'CIBER_INTEL_MISP',
  DOXING_LEAKS = 'DOXING_LEAKS',
  
  // Vuln Research & CTI (NUEVO)
  VULN_SEARCHSPLOIT = 'VULN_SEARCHSPLOIT',
  VULN_MITRE_OWASP = 'VULN_MITRE_OWASP',
  VULN_CVSS_CALC = 'VULN_CVSS_CALC',

  // Bug Bounty & Recon
  RECON_NMAP = 'RECON_NMAP',
  RECON_MASSCAN = 'RECON_MASSCAN',
  BUG_BOUNTY_RECON = 'BUG_BOUNTY_RECON',
  BUG_BOUNTY_HTTPX = 'BUG_BOUNTY_HTTPX',
  BUG_BOUNTY_VULN_NUCLEI = 'BUG_BOUNTY_VULN_NUCLEI',
  BUG_BOUNTY_VULN_NESSUS = 'BUG_BOUNTY_VULN_NESSUS',

  // Cloud Security
  CLOUD_AWS_PACU = 'CLOUD_AWS_PACU',
  CLOUD_AZURE_HOUND = 'CLOUD_AZURE_HOUND',

  // Mobile Hacking
  MOBILE_STATIC = 'MOBILE_STATIC',
  MOBILE_DYNAMIC = 'MOBILE_DYNAMIC',

  // Weaponization
  COBALT_STRIKE = 'COBALT_STRIKE',
  SLIVER_C2 = 'SLIVER_C2',
  HAVOC_C2 = 'HAVOC_C2',
  PAYLOAD_GEN = 'PAYLOAD_GEN',
  PHISHING_PREP = 'PHISHING_PREP',
  SOCIAL_ENGINEERING = 'SOCIAL_ENGINEERING',

  // Web Hacking
  BURP_CAIDO = 'BURP_CAIDO',
  WHATWEB_CURL = 'WHATWEB_CURL',
  NIKTO = 'NIKTO',
  GOBUSTER_FFUF = 'GOBUSTER_FFUF',
  SQLMAP = 'SQLMAP',
  COMMIX = 'COMMIX',
  WPSCAN_CMS = 'WPSCAN_CMS',
  OWASP_ZAP = 'OWASP_ZAP',

  // Initial Access
  METASPLOIT = 'METASPLOIT',
  RESPONDER = 'RESPONDER',
  HYDRA_HASHCAT = 'HYDRA_HASHCAT',
  WIFITE = 'WIFITE',
  BETTERCAP = 'BETTERCAP',
  KISMET = 'KISMET',
  WIFI_ATTACKS = 'WIFI_ATTACKS',

  // Post Exploitation
  PRIV_ESC = 'PRIV_ESC',
  ACTIVE_DIRECTORY = 'ACTIVE_DIRECTORY',
  CRACKMAPEXEC = 'CRACKMAPEXEC',
  MIMIKATZ = 'MIMIKATZ',
  PERSISTENCE = 'PERSISTENCE',

  // Forensics
  FORENSICS_AUTOPSY = 'FORENSICS_AUTOPSY',
  FORENSICS_VOLATILITY = 'FORENSICS_VOLATILITY',
  FORENSICS_WIRESHARK = 'FORENSICS_WIRESHARK',
  
  // Reporting
  REPORT_GENERATOR = 'REPORT_GENERATOR'
}

export interface Tool {
  id: ModuleType;
  name: string;
  description: string;
  icon: string;
  category: ModuleCategory;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  isCommand?: boolean;
}

export type AIProviderId = 'gemini' | 'ollama';

export interface UserProfile {
  name: string;
  initials: string;
  role: string;
  lastLogin?: string;
}

export type Language = 'es' | 'en';

export interface EvidenceImage {
  id: string;
  dataUrl: string;
  caption: string;
}

export interface AuditFinding {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  title: string;
  description: string;
  remediation: string;
}

export interface AuditReport {
  title: string;
  target: string;
  date: string;
  auditor: string;
  executiveSummary: string;
  findings: AuditFinding[];
  conclusion: string;
}