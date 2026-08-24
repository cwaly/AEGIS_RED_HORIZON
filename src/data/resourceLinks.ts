export enum LinkCategory {
  METHODOLOGY = 'WIKIS DE METODOLOGÍA & CHEATSHEETS',
  MITRE_OWASP = 'MITRE ATT&CK & OWASP',
  CVSS = 'CVSS & CALCULADORAS DE SEVERIDAD',
  CVE_EXPLOITS = 'CVE, EXPLOITS & ADVISORIES',
  OSINT_PEOPLE = 'OSINT · PERSONAS, USUARIOS & LEAKS',
  OSINT_IMAGES = 'OSINT · IMÁGENES & REVERSE SEARCH',
  OSINT_INFRA = 'OSINT · DOMINIOS, DNS & INFRAESTRUCTURA',
  HASH_CRYPTO = 'HASH IDENTIFICATION & CRYPTO',
  CTF_PRACTICE = 'CTF · PLATAFORMAS DE PRÁCTICA',
  MALWARE_SANDBOX = 'MALWARE & SANDBOX ANALYSIS',
  CLOUD_TOOLS = 'CLOUD SECURITY · HERRAMIENTAS',
  MOBILE_TOOLS = 'MOBILE SECURITY · HERRAMIENTAS',
  WIRELESS_NETWORK = 'WIRELESS & NETWORK OSINT',
}

export interface ResourceLink {
  name: string;
  url: string;
  description: string;
  category: LinkCategory;
}

export const RESOURCE_LINKS: ResourceLink[] = [
  // Wikis de metodología & cheatsheets
  { name: 'HackTricks', url: 'https://hacktricks.wiki/es/index.html', description: 'Wiki de técnicas de pentesting y escalada, la referencia estándar de facto.', category: LinkCategory.METHODOLOGY },
  { name: 'HackTricks Cloud', url: 'https://cloud.hacktricks.wiki/es/index.html', description: 'Pentesting y red team específico para AWS, Azure y GCP.', category: LinkCategory.METHODOLOGY },
  { name: 'PayloadsAllTheThings', url: 'https://github.com/swisskyrepo/PayloadsAllTheThings', description: 'Payloads, bypasses y metodología por vulnerabilidad y tecnología.', category: LinkCategory.METHODOLOGY },
  { name: 'SecLists', url: 'https://github.com/danielmiessler/SecLists', description: 'La colección de wordlists más usada: usuarios, passwords, fuzzing, payloads.', category: LinkCategory.METHODOLOGY },
  { name: 'GTFOBins', url: 'https://gtfobins.github.io/', description: 'Binarios Unix abusables para bypass de restricciones locales.', category: LinkCategory.METHODOLOGY },
  { name: 'LOLBAS', url: 'https://lolbas-project.github.io/', description: 'Binarios y scripts nativos de Windows vivos de la tierra (LOLBins).', category: LinkCategory.METHODOLOGY },
  { name: 'LOLDrivers', url: 'https://www.loldrivers.io/', description: 'Drivers legítimos de Windows abusables para BYOVD y bypass de EDR.', category: LinkCategory.METHODOLOGY },
  { name: 'WADComs', url: 'https://wadcoms.github.io/', description: 'Como GTFOBins pero para herramientas ofensivas de Active Directory.', category: LinkCategory.METHODOLOGY },
  { name: 'Revshells', url: 'https://www.revshells.com/', description: 'Generador interactivo de reverse shells para múltiples lenguajes.', category: LinkCategory.METHODOLOGY },
  { name: 'Awesome Hacking', url: 'https://github.com/Hack-with-Github/Awesome-Hacking', description: 'Lista curada de herramientas, recursos y tutoriales de hacking.', category: LinkCategory.METHODOLOGY },
  { name: 'The Book of Secret Knowledge', url: 'https://github.com/trimstray/the-book-of-secret-knowledge', description: 'Colección masiva de herramientas y trucos para sysadmins y pentesters.', category: LinkCategory.METHODOLOGY },

  // MITRE ATT&CK & OWASP
  { name: 'MITRE ATT&CK', url: 'https://attack.mitre.org/', description: 'Matriz de tácticas y técnicas adversarias, la referencia para mapear TTPs.', category: LinkCategory.MITRE_OWASP },
  { name: 'MITRE CWE', url: 'https://cwe.mitre.org/', description: 'Catálogo de debilidades de software (Common Weakness Enumeration).', category: LinkCategory.MITRE_OWASP },
  { name: 'MITRE CAPEC', url: 'https://capec.mitre.org/', description: 'Patrones de ataque comunes, complemento de CWE para modelar amenazas.', category: LinkCategory.MITRE_OWASP },
  { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', description: 'Los 10 riesgos más críticos en aplicaciones web.', category: LinkCategory.MITRE_OWASP },
  { name: 'OWASP API Security Top 10', url: 'https://owasp.org/www-project-api-security/', description: 'Los 10 riesgos más críticos específicos de APIs.', category: LinkCategory.MITRE_OWASP },
  { name: 'OWASP Testing Guide (WSTG)', url: 'https://owasp.org/www-project-web-security-testing-guide/', description: 'Metodología detallada para pruebas de seguridad web paso a paso.', category: LinkCategory.MITRE_OWASP },
  { name: 'OWASP Cheat Sheet Series', url: 'https://cheatsheetseries.owasp.org/', description: 'Cheatsheets de referencia rápida por vulnerabilidad y control.', category: LinkCategory.MITRE_OWASP },
  { name: 'OWASP MASVS / MASTG', url: 'https://mas.owasp.org/', description: 'Estándar y guía de testing de seguridad para apps móviles.', category: LinkCategory.MITRE_OWASP },

  // CVSS & severidad
  { name: 'NVD CVSS v4 Calculator', url: 'https://nvd.nist.gov/vuln-metrics/cvss/v4-calculator', description: 'Calculadora oficial NIST para el vector CVSS v4.0.', category: LinkCategory.CVSS },
  { name: 'FIRST CVSS v3.1 Calculator', url: 'https://www.first.org/cvss/calculator/3.1', description: 'Calculadora oficial de FIRST.org para CVSS v3.1.', category: LinkCategory.CVSS },
  { name: 'Beagle Security CVSS4', url: 'https://beaglesecurity.com/cvss4-risk-calculator?vector=AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N', description: 'Calculadora CVSS v4 con explicación de riesgo por métrica.', category: LinkCategory.CVSS },
  { name: 'FIRST EPSS', url: 'https://www.first.org/epss/', description: 'Probabilidad de explotación real de un CVE, para priorizar remediación.', category: LinkCategory.CVSS },

  // CVE / Exploits
  { name: 'CVE.org', url: 'https://www.cve.org/', description: 'Lista oficial de identificadores CVE mantenida por MITRE.', category: LinkCategory.CVE_EXPLOITS },
  { name: 'NVD - Búsqueda de CVE', url: 'https://nvd.nist.gov/vuln/search', description: 'Base de datos oficial de vulnerabilidades (NIST), con scoring y referencias.', category: LinkCategory.CVE_EXPLOITS },
  { name: 'Exploit-DB', url: 'https://www.exploit-db.com/', description: 'Repositorio público de exploits, equivalente web de SearchSploit.', category: LinkCategory.CVE_EXPLOITS },
  { name: 'Rapid7 Vulnerability & Exploit DB', url: 'https://www.rapid7.com/db/', description: 'Base de datos de vulnerabilidades y módulos de Metasploit.', category: LinkCategory.CVE_EXPLOITS },
  { name: 'Packet Storm Security', url: 'https://packetstormsecurity.com/', description: 'Archivo histórico de exploits, advisories y herramientas de seguridad.', category: LinkCategory.CVE_EXPLOITS },
  { name: 'CVE Details', url: 'https://www.cvedetails.com/', description: 'Buscador de CVEs con estadísticas y filtros por producto/vendor.', category: LinkCategory.CVE_EXPLOITS },
  { name: 'GitHub Advisory Database', url: 'https://github.com/advisories', description: 'Advisories de seguridad para paquetes y dependencias open source.', category: LinkCategory.CVE_EXPLOITS },
  { name: 'Vulners', url: 'https://vulners.com/', description: 'Motor de búsqueda que cruza CVEs con exploits y advisories.', category: LinkCategory.CVE_EXPLOITS },

  // OSINT personas / usuarios / leaks
  { name: 'WhatsMyName', url: 'https://whatsmyname.app/', description: 'Búsqueda de un username a través de cientos de sitios.', category: LinkCategory.OSINT_PEOPLE },
  { name: 'Namechk', url: 'https://namechk.com/', description: 'Verifica disponibilidad/uso de un username en decenas de plataformas.', category: LinkCategory.OSINT_PEOPLE },
  { name: 'Have I Been Pwned', url: 'https://haveibeenpwned.com/', description: 'Verifica si un correo o dominio aparece en brechas conocidas.', category: LinkCategory.OSINT_PEOPLE },
  { name: 'DeHashed', url: 'https://dehashed.com/', description: 'Búsqueda de credenciales filtradas por correo, usuario o dominio.', category: LinkCategory.OSINT_PEOPLE },
  { name: 'Epieos', url: 'https://epieos.com/', description: 'OSINT sobre un correo: cuentas asociadas, Google, redes sociales.', category: LinkCategory.OSINT_PEOPLE },
  { name: 'Social Searcher', url: 'https://www.social-searcher.com/', description: 'Búsqueda y monitoreo de menciones en redes sociales en tiempo real.', category: LinkCategory.OSINT_PEOPLE },
  { name: 'IntelTechniques Tools', url: 'https://inteltechniques.com/tools/', description: 'Colección de herramientas OSINT de Michael Bazzell por categoría.', category: LinkCategory.OSINT_PEOPLE },

  // OSINT imágenes / reverse search
  { name: 'Google Images', url: 'https://images.google.com/', description: 'Búsqueda inversa de imágenes de propósito general.', category: LinkCategory.OSINT_IMAGES },
  { name: 'Google Lens', url: 'https://lens.google.com/', description: 'Búsqueda visual e identificación de objetos/texto en imágenes.', category: LinkCategory.OSINT_IMAGES },
  { name: 'Yandex Images', url: 'https://yandex.com/images/', description: 'El motor con mejor reconocimiento de rostros para reverse search.', category: LinkCategory.OSINT_IMAGES },
  { name: 'TinEye', url: 'https://tineye.com/', description: 'Reverse image search enfocado en encontrar el origen de una imagen.', category: LinkCategory.OSINT_IMAGES },
  { name: 'FotoForensics', url: 'https://fotoforensics.com/', description: 'Análisis forense de imágenes (Error Level Analysis) para detectar ediciones.', category: LinkCategory.OSINT_IMAGES },
  { name: 'Jimpl', url: 'https://jimpl.com/', description: 'Visor de metadatos EXIF (geolocalización, dispositivo, fecha) de una imagen.', category: LinkCategory.OSINT_IMAGES },

  // OSINT dominios / DNS / infraestructura
  { name: 'crt.sh', url: 'https://crt.sh/', description: 'Búsqueda de certificados TLS emitidos (certificate transparency logs).', category: LinkCategory.OSINT_INFRA },
  { name: 'Shodan', url: 'https://www.shodan.io/', description: 'Motor de búsqueda de dispositivos y servicios expuestos a Internet.', category: LinkCategory.OSINT_INFRA },
  { name: 'Censys Search', url: 'https://search.censys.io/', description: 'Descubrimiento de hosts, certificados y servicios expuestos.', category: LinkCategory.OSINT_INFRA },
  { name: 'VirusTotal', url: 'https://www.virustotal.com/', description: 'Análisis de IPs, dominios, hashes y archivos contra múltiples motores.', category: LinkCategory.OSINT_INFRA },
  { name: 'DNSDumpster', url: 'https://dnsdumpster.com/', description: 'Mapeo de subdominios e infraestructura DNS de un dominio.', category: LinkCategory.OSINT_INFRA },
  { name: 'SecurityTrails', url: 'https://securitytrails.com/', description: 'Historial de DNS, subdominios y WHOIS de un dominio.', category: LinkCategory.OSINT_INFRA },
  { name: 'ViewDNS.info', url: 'https://viewdns.info/', description: 'Suite de utilidades DNS/WHOIS: reverse IP, port scan, propagation.', category: LinkCategory.OSINT_INFRA },
  { name: 'urlscan.io', url: 'https://urlscan.io/', description: 'Escaneo y análisis sandboxed de una URL: requests, dominios, screenshot.', category: LinkCategory.OSINT_INFRA },
  { name: 'Wayback Machine', url: 'https://web.archive.org/', description: 'Historial archivado de páginas web, útil para recon de endpoints viejos.', category: LinkCategory.OSINT_INFRA },
  { name: 'BuiltWith', url: 'https://builtwith.com/', description: 'Fingerprinting de stack tecnológico de un sitio web.', category: LinkCategory.OSINT_INFRA },

  // Hash / Crypto
  { name: 'CyberChef', url: 'https://gchq.github.io/CyberChef/', description: 'La "navaja suiza" para decodificar, cifrar y transformar datos.', category: LinkCategory.HASH_CRYPTO },
  { name: 'CrackStation', url: 'https://crackstation.net/', description: 'Búsqueda de hashes contra rainbow tables precomputadas.', category: LinkCategory.HASH_CRYPTO },
  { name: 'Hashes.com Identifier', url: 'https://hashes.com/en/tools/hash_identifier', description: 'Identificación automática del tipo/algoritmo de un hash.', category: LinkCategory.HASH_CRYPTO },
  { name: 'dCode.fr', url: 'https://www.dcode.fr/', description: 'Identificador y solver de cifrados clásicos (CTF crypto/misc).', category: LinkCategory.HASH_CRYPTO },

  // CTF / práctica
  { name: 'Hack The Box', url: 'https://www.hackthebox.com/', description: 'Máquinas y labs de pentesting bajo demanda, referencia de la industria.', category: LinkCategory.CTF_PRACTICE },
  { name: 'TryHackMe', url: 'https://tryhackme.com/', description: 'Rutas guiadas de aprendizaje y salas prácticas para todos los niveles.', category: LinkCategory.CTF_PRACTICE },
  { name: 'VulnHub', url: 'https://www.vulnhub.com/', description: 'Máquinas virtuales vulnerables descargables para practicar offline.', category: LinkCategory.CTF_PRACTICE },
  { name: 'PicoCTF', url: 'https://picoctf.org/', description: 'Plataforma de CTF orientada a principiantes, por Carnegie Mellon.', category: LinkCategory.CTF_PRACTICE },
  { name: 'OverTheWire', url: 'https://overthewire.org/wargames/', description: 'Wargames clásicos de Linux/seguridad por niveles progresivos.', category: LinkCategory.CTF_PRACTICE },
  { name: 'CTFtime', url: 'https://ctftime.org/', description: 'Calendario y ranking de competencias CTF activas en el mundo.', category: LinkCategory.CTF_PRACTICE },

  // Malware / sandbox
  { name: 'Any.run', url: 'https://any.run/', description: 'Sandbox interactivo en la nube para analizar malware en vivo.', category: LinkCategory.MALWARE_SANDBOX },
  { name: 'Hybrid Analysis', url: 'https://www.hybrid-analysis.com/', description: 'Análisis automatizado de malware (estático + dinámico), gratuito.', category: LinkCategory.MALWARE_SANDBOX },
  { name: 'MalwareBazaar', url: 'https://bazaar.abuse.ch/', description: 'Repositorio de muestras de malware compartidas por la comunidad (abuse.ch).', category: LinkCategory.MALWARE_SANDBOX },
  { name: 'URLhaus', url: 'https://urlhaus.abuse.ch/', description: 'Base de datos de URLs maliciosas usadas para distribuir malware.', category: LinkCategory.MALWARE_SANDBOX },

  // Cloud security
  { name: 'Prowler', url: 'https://github.com/prowler-cloud/prowler', description: 'Herramienta open source de auditoría de seguridad para AWS/Azure/GCP.', category: LinkCategory.CLOUD_TOOLS },
  { name: 'ScoutSuite', url: 'https://github.com/nccgroup/ScoutSuite', description: 'Auditoría de seguridad multi-cloud (AWS, Azure, GCP) de NCC Group.', category: LinkCategory.CLOUD_TOOLS },
  { name: 'Pacu', url: 'https://github.com/RhinoSecurityLabs/pacu', description: 'Framework de explotación ofensiva para entornos AWS.', category: LinkCategory.CLOUD_TOOLS },
  { name: 'ROADtools', url: 'https://github.com/dirkjanm/ROADtools', description: 'Framework de reconocimiento y explotación de Azure AD / Entra ID.', category: LinkCategory.CLOUD_TOOLS },

  // Mobile security
  { name: 'MobSF', url: 'https://github.com/MobSF/Mobile-Security-Framework-MobSF', description: 'Framework todo-en-uno de análisis estático y dinámico para apps móviles.', category: LinkCategory.MOBILE_TOOLS },
  { name: 'Frida', url: 'https://frida.re/', description: 'Toolkit de instrumentación dinámica para hooking en apps móviles/nativas.', category: LinkCategory.MOBILE_TOOLS },
  { name: 'Objection', url: 'https://github.com/sensepost/objection', description: 'Exploración runtime sin jailbreak/root, construido sobre Frida.', category: LinkCategory.MOBILE_TOOLS },

  // Wireless / network OSINT
  { name: 'Aircrack-ng', url: 'https://www.aircrack-ng.org/', description: 'Suite estándar para auditoría de redes WiFi (captura, cracking, inyección).', category: LinkCategory.WIRELESS_NETWORK },
  { name: 'WiGLE', url: 'https://wigle.net/', description: 'Base de datos colaborativa de redes wireless geolocalizadas.', category: LinkCategory.WIRELESS_NETWORK },
  { name: 'Wireshark', url: 'https://www.wireshark.org/', description: 'Analizador de protocolos de red y captura de paquetes de referencia.', category: LinkCategory.WIRELESS_NETWORK },
];
