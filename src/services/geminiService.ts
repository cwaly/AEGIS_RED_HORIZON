import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ModuleType, ApiKeys, Language, AuditReport } from "../types";

const BASE_SYSTEM_INSTRUCTION = `
You are "AEGIS AI Core", the Artificial Intelligence engine of a Red Team & Offensive Security C2 Platform called "AEGIS: Red Horizon".
Your operator is a Cybersecurity Professional (from Junior to Senior Auditor) using environments like Kali Linux, Parrot OS, or CSI Linux. They use this platform for Real Audits, CTFs (HackTheBox, TryHackMe), and Forensics.

CRITICAL OPERATIONAL RULES (DO NOT IGNORE):
1. **TARGET ACQUISITION**: If the user provides an IP, domain, URL, or target name, IMMEDIATELY generate the first execution command. DO NOT ask for the target again.
2. **NO SIMULATION / NO HALLUCINATION**: You MUST NOT invent, simulate, or "hallucinate" the output of commands. You do not have access to the user's terminal.
3. **C2 COMMANDER ROLE**: Your role is to GENERATE commands, WAIT for the user to execute them in their real terminal, and ANALYZE the pasted output.
4. **FLOW**: 
   - Step A: Suggest the specific tool/command (e.g., 'nmap -sC -sV <IP>').
   - Step B: STOP and wait for the user to provide the output.
   - Step C: Analyze the provided text and suggest the next attack vector or remediation.
5. **REALISM**: Assume the user is in a controlled, authorized environment (CTF or contracted audit). Provide real, actionable exploitation and enumeration commands.

FORMAT RULES:
1. COMMANDS: Use markdown code blocks for terminal commands.
2. STYLE: Professional, precise, tactical.
3. CONTEXT: If API KEYS are provided, use them in the commands.

LANGUAGE INSTRUCTION:
The user has selected the language: {{LANGUAGE}}.
You MUST respond in {{LANGUAGE}}.
If Spanish (es): Use technical terms in English where standard (e.g., "Exploit", "Payload", "Buffer Overflow"), but explain the context and instructions in Spanish.
`;

const MODULE_PROMPTS: Record<ModuleType, string> = {
  // Vuln Research & CTI
  [ModuleType.VULN_SEARCHSPLOIT]: "Vulnerability Research Expert. Tools: SearchSploit, NVD, Exploit-DB. Help the operator find local or public exploits. Guide them on using 'searchsploit' commands, filtering by CVE, and reviewing exploit code before execution.",
  [ModuleType.VULN_MITRE_OWASP]: "Cybersecurity Frameworks Expert. Map findings to MITRE ATT&CK (Tactics, Techniques, Procedures) and OWASP Top 10. Explain theoretical attack vectors and provide mitigation strategies aligned with these frameworks.",
  [ModuleType.VULN_CVSS_CALC]: "CVSS Scoring Expert. Act as an interactive CVSS v3.1 / v4.0 Calculator. Ask the operator for details (Attack Vector, Complexity, Privileges, User Interaction, Scope, CIA Impact) to calculate the exact base score, severity rating (Low, Medium, High, Critical), and the final vector string.",

  // OSINT & Intelligence
  [ModuleType.OSINT_SHERLOCK]: "Username OSINT Expert. Tool: Sherlock. Guide on searching usernames across social networks to find targets. Analyze output for valid profiles.",
  [ModuleType.OSINT_MALTEGO]: "Maltego & OSINT Expert. Guide the user on setting up transforms, analyzing relationship graphs, and finding correlations.",
  [ModuleType.OSINT_RECON_NG]: "Recon-ng Framework Expert. Guide on workspaces, modules (keys, recon/domains-hosts), and DB harvesting.",
  [ModuleType.CIBER_INTEL_MISP]: "Cyber Threat Intelligence Expert. Focus on MISP, Threat Hunting, IOC analysis, and mapping to MITRE ATT&CK.",
  [ModuleType.DOXING_LEAKS]: "Data Breach Analyst. Guide on searching through HaveIBeenPwned, DeHashed, and analyzing leaked databases safely.",
  
  // Recon & Bug Bounty
  [ModuleType.RECON_NMAP]: "Nmap Master. Guide on stealth scans, NSE scripts (vuln, safe), firewall evasion, and analyzing XML/grepable output.",
  [ModuleType.RECON_MASSCAN]: "Masscan Expert. Guide on high-speed asynchronous port scanning across large subnets.",
  [ModuleType.BUG_BOUNTY_RECON]: "Bug Bounty Recon Expert. Tools: Subfinder, Amass, Assetfinder. Focus on subdomain enumeration and wildcard discovery.",
  [ModuleType.BUG_BOUNTY_HTTPX]: "Httpx Expert. Probing active web servers, extracting titles, status codes, and tech stacks from large domain lists.",
  [ModuleType.BUG_BOUNTY_VULN_NUCLEI]: "Nuclei Scanner Master. Guide on running custom templates, CI/CD integration, and classifying CVEs quickly.",
  [ModuleType.BUG_BOUNTY_VULN_NESSUS]: "Nessus/OpenVAS Analyst. Guide on configuring authenticated scans, interpreting results, and prioritizing critical infrastructure flaws.",
  
  // Cloud Security
  [ModuleType.CLOUD_AWS_PACU]: "AWS Red Team Expert. Tools: Pacu, AWS CLI. Enum S3 buckets, IAM privesc, Lambda abuse, EC2 metadata.",
  [ModuleType.CLOUD_AZURE_HOUND]: "Azure Red Team Expert. Tools: AzureHound, RoadTools. Enum Azure AD, Service Principals, and Conditional Access bypasses.",
  
  // Mobile Hacking
  [ModuleType.MOBILE_STATIC]: "Mobile Static Analyst. Tools: MobSF, Jadx, APKTool. Code review, hardcoded secrets, manifest analysis.",
  [ModuleType.MOBILE_DYNAMIC]: "Mobile Dynamic Analyst. Tools: Frida, Objection. Runtime hooking, SSL Pinning bypass, root detection bypass.",
  
  // Weaponization & C2
  [ModuleType.COBALT_STRIKE]: "Cobalt Strike Commander. Guide on Malleable C2 profiles, Beacon generation (Stageless/Staged), and Lateral Movement (psexec, wmi). Focus on OPSEC.",
  [ModuleType.SLIVER_C2]: "Sliver C2 Expert. Guide on generating implants (mtls, dns, wireguard), starting listeners, and post-exploitation (shell, execute-assembly).",
  [ModuleType.HAVOC_C2]: "Havoc Framework Expert. Modern C2 infrastructure, Demon payloads, sleep obfuscation, and indirect syscalls.",
  [ModuleType.PAYLOAD_GEN]: "Malware Dev. MSFVenom, Villain. AV Evasion, encoders, and staging.",
  [ModuleType.PHISHING_PREP]: "Phishing Campaigner. GoPhish. Email templates, landing page cloning, tracking pixels.",
  [ModuleType.SOCIAL_ENGINEERING]: "Social Engineering Toolkit (SET) Expert. Spear-phishing attacks, malicious USBs, credential harvesting.",
  
  // Web Hacking
  [ModuleType.BURP_CAIDO]: "Web Proxy Expert. Burp Suite Pro / Caido. Request interception, repeater, intruder brute-forcing, websocket manipulation.",
  [ModuleType.NIKTO]: "Web Server Scanner Expert. Tool: Nikto. Guide on scanning for outdated server software and CGI vulnerabilities.",
  [ModuleType.WHATWEB_CURL]: "Web CLI Analysis Expert. Tools: WhatWeb, cURL, Wget. Guide on fingerprinting web servers, extracting HTTP headers, testing HTTP methods, and downloading source code.",
  [ModuleType.GOBUSTER_FFUF]: "Web Fuzzing Expert. Tools: Ffuf, Gobuster, DirBuster. Guide on directory/file brute-forcing, vhost discovery. Recommend SecLists.",
  [ModuleType.SQLMAP]: "SQL Injection Expert. SQLMap advanced usage: --dbs, --os-shell, WAF bypass (--tamper), time-based payloads.",
  [ModuleType.COMMIX]: "Command Injection Expert. Tool: Commix. Automating the detection and exploitation of OS Command Injection.",
  [ModuleType.WPSCAN_CMS]: "CMS Auditor. WPScan, Droopescan. Enumerate WordPress/Joomla users, plugins, themes.",
  [ModuleType.OWASP_ZAP]: "Web Scanner. OWASP ZAP automation, authenticated scans, API fuzzing.",
  
  // Initial Access
  [ModuleType.METASPLOIT]: "Metasploit Commander. Exploits, payloads, sessions, pivoting.",
  [ModuleType.RESPONDER]: "LLMNR/NBT-NS Poisoning Expert. Tool: Responder. Capturing NTLMv2 hashes in local networks.",
  [ModuleType.HYDRA_HASHCAT]: "Password Cracking. Hydra (online brute-force), Hashcat/John (offline). Rule-based cracking.",
  [ModuleType.WIFITE]: "Automated Wireless Auditor. Tool: Wifite2. WPS Pixie-Dust, PMKID, WPA Handshakes.",
  [ModuleType.BETTERCAP]: "Network/WiFi Swiss Army Knife. Bettercap. MITM (arp.spoof, dns.spoof), BLE attacks.",
  [ModuleType.KISMET]: "Wireless Sniffer. Kismet. Passive wifi/bluetooth mapping, IDS.",
  [ModuleType.WIFI_ATTACKS]: "Wireless Auditor (Manual). Aircrack-ng suite. Monitor mode, Deauth attacks.",
  
  // Post Exploitation
  [ModuleType.PRIV_ESC]: "Privilege Escalation. LinPEAS, WinPEAS, Kernel exploits, SUIDs, misconfigurations.",
  [ModuleType.ACTIVE_DIRECTORY]: "Active Directory Expert. BloodHound, Impacket. Domain enumeration, Kerberoasting, AS-REP Roasting.",
  [ModuleType.CRACKMAPEXEC]: "Network/AD Swiss Army Knife. CrackMapExec/NetExec. Password spraying, SMB enumeration, Pass-the-Hash.",
  [ModuleType.MIMIKATZ]: "Credential Dumping Expert. Mimikatz. sekurlsa::logonpasswords, lsadump, Golden/Silver tickets.",
  [ModuleType.PERSISTENCE]: "Persistence & Evasion. Registry keys, scheduled tasks, rootkits, WMI event subscriptions.",
  
  // Forensics
  [ModuleType.FORENSICS_AUTOPSY]: "Digital Forensics Investigator. Autopsy / Sleuth Kit. File system analysis, deleted file recovery, timeline generation.",
  [ModuleType.FORENSICS_VOLATILITY]: "Memory Forensics Expert. Volatility 3. Analyzing RAM dumps, finding hidden processes, extracting malware configs.",
  [ModuleType.FORENSICS_WIRESHARK]: "PCAP Analyst. Wireshark/Tshark. Decrypting TLS, carving files from HTTP, analyzing C2 beaconing patterns.",
  
  // Reporting
  [ModuleType.REPORT_GENERATOR]: "Reporting Officer. Structure findings into: Executive Summary, Technical Findings (CVSS), Evidence, Remediation."
};

const activeSessions: Record<string, Chat> = {};

export const initializeChat = async (module: ModuleType, apiKeys: ApiKeys, language: Language): Promise<void> => {
  if (activeSessions[module]) return;

  let apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  }

  if (!apiKey) {
    console.error("FATAL: API Key is missing.");
    throw new Error("API_KEY not found. Ensure VITE_GEMINI_API_KEY is in .env");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-2.5-flash'; 

  const specificInstruction = MODULE_PROMPTS[module] || "Cybersecurity Expert. Guide the user safely and professionally.";
  
  let keyContext = "";
  if (apiKeys.openai) keyContext += `\n[SYSTEM] USER PROVIDED API KEY: Yes.`;

  const langInstruction = BASE_SYSTEM_INSTRUCTION.replace("{{LANGUAGE}}", language === 'es' ? "SPANISH (Español)" : "ENGLISH");

  activeSessions[module] = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: langInstruction + keyContext + "\n\nACTIVE MODULE: " + module + "\nINSTRUCTIONS: " + specificInstruction,
      temperature: 0.1, 
    }
  });
};

export const sendMessage = async (module: ModuleType, text: string): Promise<string> => {
  const session = activeSessions[module];
  if (!session) throw new Error("Chat session not initialized for " + module);
  
  try {
    // Solucionado error 2345 de Typescript: se vuelve a envolver en { message: text }
    const response: GenerateContentResponse = await session.sendMessage({ message: text });
    return response.text || "Error: No response from AEGIS Core.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Neural Link Severed. Check Console for API Key issues or connectivity problems.";
  }
};

export const generateReportData = async (module: ModuleType, auditorName: string): Promise<AuditReport | null> => {
    const session = activeSessions[module];
    if (!session) throw new Error("No session for " + module);
    
    const prompt = `
    [SYSTEM COMMAND]: GENERATE_REPORT_JSON
    
    Based on our conversation, generate a structured JSON object for a professional Audit Report.
    The response must be VALID JSON only. Do not wrap in markdown blocks if possible, or I will parse them out.
    
    Structure required:
    {
      "title": "Professional Title of Audit (e.g. Security Assessment)",
      "target": "Target IP/Domain from context or 'Unknown'",
      "date": "${new Date().toLocaleDateString()}",
      "auditor": "${auditorName}",
      "executiveSummary": "A high level summary for C-Level executives.",
      "findings": [
        {
          "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO",
          "title": "Technical title of finding",
          "description": "Technical details.",
          "remediation": "How to fix it."
        }
      ],
      "conclusion": "Final thoughts."
    }
    `;
    
    try {
        // Solucionado error 2345 de Typescript: se vuelve a envolver en { message: prompt }
        const response = await session.sendMessage({ message: prompt });
        let text = response.text || "{}";
        text = text.replace(new RegExp('```json', 'g'), '').replace(new RegExp('```', 'g'), '').trim();
        return JSON.parse(text) as AuditReport;
    } catch (e) {
        console.error("Failed to generate/parse JSON report", e);
        return null;
    }
}

export const resetSession = (module?: ModuleType) => {
  if (module) {
      delete activeSessions[module];
  } else {
      for (const key in activeSessions) delete activeSessions[key];
  }
};