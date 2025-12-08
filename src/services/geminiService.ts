import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ModuleType, ApiKeys, Language, AuditReport } from "../types";

const BASE_SYSTEM_INSTRUCTION = `
You are "Aura Red", the AI Intelligence Core of a Red Team C2 Platform called "Aura Ops: Red Horizon".
Your operator is a Cybersecurity Professional (Junior to Senior) using Kali Linux or Parrot OS.

OBJECTIVE:
Guide offensive operations step-by-step, providing exact terminal commands, strategy, and output analysis.

FORMAT RULES:
1. COMMANDS: Use markdown code blocks for terminal commands.
2. STYLE: Military, precise, Cyberpunk.
3. CONTEXT: If API KEYS are provided, use them in the commands (e.g., 'wpscan --api-token <KEY>').
4. SAFETY: Warn about scope, but assume authorized audit environment.

LANGUAGE INSTRUCTION:
The user has selected the language: {{LANGUAGE}}.
You MUST respond in {{LANGUAGE}}.
If Spanish (es): Use technical terms in English where standard (e.g., "Exploit", "Payload"), but explain in Spanish.
If English (en): Respond entirely in English.
`;

const MODULE_PROMPTS: Record<ModuleType, string> = {
  [ModuleType.OSINT_GENERAL]: "Expert in OSINT. Tools: TheHarvester, Maltego, Google Dorks. Passive reconnaissance.",
  [ModuleType.SHODAN]: "Shodan Expert. Use 'shodan' CLI or 'curl'. Filter by port, org, country. Search for CVEs.",
  [ModuleType.NMAP]: "Nmap/Masscan Master. Stealth scans, NSE scripts, firewall evasion. XML output analysis.",
  [ModuleType.WIRESHARK]: "Traffic Analyst. Wireshark, Tshark, Ettercap. Credential sniffing, protocol analysis.",
  
  [ModuleType.BUG_BOUNTY_RECON]: "Bug Bounty Recon Expert. Tools: Subfinder, Amass, Assetfinder, HttpX. Focus on subdomain enumeration, wildcard discovery, and asset mapping. Scope validation.",
  [ModuleType.BUG_BOUNTY_VULN]: "Bug Bounty Scanner. Tools: Nuclei, Jaeger, GF patterns. Automating CVE detection, misconfigurations, and fuzzing. Focus on P1-P4 classification.",

  [ModuleType.PAYLOAD_GEN]: "Malware Dev. MSFVenom, Veil. AV Evasion (encoding, encryption).",
  [ModuleType.PHISHING_PREP]: "Social Engineering. GoPhish, SET. Email templates, landing page cloning.",

  [ModuleType.BURP_CAIDO]: "Web Proxy Expert. Burp Suite Pro / Caido. Request interception, repeater, intruder.",
  [ModuleType.SQLMAP]: "SQL Injection Expert. SQLMap advanced usage: --dbs, --os-shell, WAF bypass (--tamper).",
  [ModuleType.WPSCAN]: "CMS Auditor. WPScan. Enumerate users, plugins, themes. Use API Token if available for vulnerability data.",
  [ModuleType.OWASP_ZAP]: "Web Scanner. OWASP ZAP automation, authenticated scans.",

  [ModuleType.METASPLOIT]: "Metasploit Commander. Exploits, payloads, sessions, pivoting, Armitage.",
  [ModuleType.HYDRA_HASHCAT]: "Password Cracking. Hydra (online), Hashcat/John (offline). Hash identification.",
  [ModuleType.WIFI_ATTACKS]: "Wireless Auditor. Aircrack-ng suite. WPA2 Handshakes, Evil Twin.",

  [ModuleType.PRIV_ESC]: "Privilege Escalation. LinPEAS, WinPEAS, Kernel exploits, misconfigurations.",
  [ModuleType.ACTIVE_DIRECTORY]: "AD Expert. BloodHound, Impacket, Kerberoasting, LLMNR Poisoning, Golden Ticket.",
  [ModuleType.PERSISTENCE]: "Persistence & Evasion. Registry keys, scheduled tasks, services, C2 agents.",

  [ModuleType.REPORT_GENERATOR]: "Reporting Officer. Structure findings into: Executive Summary, Technical Findings (CVSS), Evidence, Remediation."
};

let chatSession: Chat | null = null;

export const initializeChat = async (module: ModuleType, apiKeys: ApiKeys, language: Language): Promise<void> => {
  // Use process.env.API_KEY as mandated by guidelines.
  // This assumes the environment is configured correctly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-2.5-flash'; 

  const specificInstruction = MODULE_PROMPTS[module];
  
  // Inject User API Keys into context
  let keyContext = "";
  if (apiKeys.shodan) keyContext += `\n[SYSTEM] USER SHODAN API KEY: ${apiKeys.shodan}`;
  if (apiKeys.virusTotal) keyContext += `\n[SYSTEM] USER VIRUSTOTAL API KEY: ${apiKeys.virusTotal}`;
  if (apiKeys.wpscan) keyContext += `\n[SYSTEM] USER WPSCAN API TOKEN: ${apiKeys.wpscan}`;

  const langInstruction = BASE_SYSTEM_INSTRUCTION.replace("{{LANGUAGE}}", language === 'es' ? "SPANISH (Español)" : "ENGLISH");

  chatSession = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: langInstruction + keyContext + "\n\nACTIVE MODULE: " + module + "\nINSTRUCTIONS: " + specificInstruction,
      temperature: 0.3, 
    }
  });
};

export const sendMessage = async (text: string): Promise<string> => {
  if (!chatSession) throw new Error("Chat session not initialized");
  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message: text });
    return response.text || "Error: No response from AI Core.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Neural Link Severed. Check Console.";
  }
};

export const generateReportData = async (module: ModuleType, auditorName: string): Promise<AuditReport | null> => {
    if (!chatSession) throw new Error("No session");
    
    const prompt = `
    [SYSTEM COMMAND]: GENERATE_REPORT_JSON
    
    Based on our conversation, generate a structured JSON object for a professional Audit Report.
    The response must be VALID JSON only. Do not wrap in markdown blocks if possible, or I will parse them out.
    
    Structure required:
    {
      "title": "Professional Title of Audit (e.g. SQL Injection Assessment)",
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
        const response = await chatSession.sendMessage({ message: prompt });
        let text = response.text || "{}";
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text) as AuditReport;
    } catch (e) {
        console.error("Failed to generate/parse JSON report", e);
        return null;
    }
}

export const resetSession = () => {
  chatSession = null;
};