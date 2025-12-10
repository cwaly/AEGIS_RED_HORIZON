
export enum ModuleCategory {
  INTELLIGENCE = 'INTELIGENCIA & RECON',
  BUG_BOUNTY = 'BUG BOUNTY HUNTING',
  CLOUD_SECURITY = 'CLOUD SECURITY (AWS/AZURE)',
  MOBILE_HACKING = 'MOBILE & APPS (ANDROID/iOS)',
  WEAPONIZATION = 'DESARROLLO DE RECURSOS & C2',
  WEB_HACKING = 'ATAQUES WEB & API',
  INITIAL_ACCESS = 'ACCESO INICIAL',
  POST_EXPLOITATION = 'POST-EXPLOTACIÓN & LATERAL',
  REPORTING = 'REPORTING & EVIDENCIA'
}

export enum ModuleType {
  // Intelligence
  OSINT_GENERAL = 'OSINT_GENERAL',
  SHODAN = 'SHODAN',
  NMAP = 'NMAP',
  WIRESHARK = 'WIRESHARK',
  SHERLOCK = 'SHERLOCK', // New
  SPIDERFOOT = 'SPIDERFOOT', // New
  
  // Bug Bounty
  BUG_BOUNTY_RECON = 'BUG_BOUNTY_RECON',
  BUG_BOUNTY_VULN = 'BUG_BOUNTY_VULN',

  // Cloud Security
  CLOUD_AWS = 'CLOUD_AWS',
  CLOUD_AZURE = 'CLOUD_AZURE',

  // Mobile Hacking
  MOBILE_STATIC = 'MOBILE_STATIC',
  MOBILE_DYNAMIC = 'MOBILE_DYNAMIC',

  // Weaponization
  PAYLOAD_GEN = 'PAYLOAD_GEN',
  PHISHING_PREP = 'PHISHING_PREP',
  COBALT_STRIKE = 'COBALT_STRIKE', // New
  SLIVER_C2 = 'SLIVER_C2', // New

  // Web Hacking
  BURP_CAIDO = 'BURP_CAIDO',
  SQLMAP = 'SQLMAP',
  WPSCAN = 'WPSCAN',
  OWASP_ZAP = 'OWASP_ZAP',

  // Initial Access
  METASPLOIT = 'METASPLOIT',
  HYDRA_HASHCAT = 'HYDRA_HASHCAT',
  WIFI_ATTACKS = 'WIFI_ATTACKS',
  RESPONDER = 'RESPONDER', // New

  // Post Exploitation
  PRIV_ESC = 'PRIV_ESC',
  ACTIVE_DIRECTORY = 'ACTIVE_DIRECTORY',
  MIMIKATZ = 'MIMIKATZ', // New
  CRACKMAPEXEC = 'CRACKMAPEXEC', // New (NetExec)
  PERSISTENCE = 'PERSISTENCE',
  
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

export interface ApiKeys {
  shodan?: string;
  virusTotal?: string;
  wpscan?: string;
  openai?: string;
}

export interface UserProfile {
  name: string;
  initials: string;
  role: string;
  lastLogin?: string;
}

export type Language = 'es' | 'en';

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
