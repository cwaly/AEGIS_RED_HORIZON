export enum LinkCategory {
  METHODOLOGY = 'WIKIS DE METODOLOGÍA & CHEATSHEETS',
  CVSS = 'CVSS & CALCULADORAS DE SEVERIDAD',
  CVE_EXPLOITS = 'CVE, EXPLOITS & ADVISORIES',
  OSINT_PEOPLE = 'OSINT · PERSONAS, USUARIOS & LEAKS',
  OSINT_IMAGES = 'OSINT · IMÁGENES & REVERSE SEARCH',
  OSINT_INFRA = 'OSINT · DOMINIOS, DNS & INFRAESTRUCTURA',
  HASH_CRYPTO = 'HASH IDENTIFICATION & CRYPTO',
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
  { name: 'GTFOBins', url: 'https://gtfobins.github.io/', description: 'Binarios Unix abusables para bypass de restricciones locales.', category: LinkCategory.METHODOLOGY },
  { name: 'LOLBAS', url: 'https://lolbas-project.github.io/', description: 'Binarios y scripts nativos de Windows vivos de la tierra (LOLBins).', category: LinkCategory.METHODOLOGY },
  { name: 'Revshells', url: 'https://www.revshells.com/', description: 'Generador interactivo de reverse shells para múltiples lenguajes.', category: LinkCategory.METHODOLOGY },

  // CVSS & severidad
  { name: 'NVD CVSS v4 Calculator', url: 'https://nvd.nist.gov/vuln-metrics/cvss/v4-calculator', description: 'Calculadora oficial NIST para el vector CVSS v4.0.', category: LinkCategory.CVSS },
  { name: 'FIRST CVSS v3.1 Calculator', url: 'https://www.first.org/cvss/calculator/3.1', description: 'Calculadora oficial de FIRST.org para CVSS v3.1.', category: LinkCategory.CVSS },
  { name: 'Beagle Security CVSS4', url: 'https://beaglesecurity.com/cvss4-risk-calculator?vector=AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N', description: 'Calculadora CVSS v4 con explicación de riesgo por métrica.', category: LinkCategory.CVSS },

  // CVE / Exploits
  { name: 'NVD - Búsqueda de CVE', url: 'https://nvd.nist.gov/vuln/search', description: 'Base de datos oficial de vulnerabilidades (NIST).', category: LinkCategory.CVE_EXPLOITS },
  { name: 'Exploit-DB', url: 'https://www.exploit-db.com/', description: 'Repositorio público de exploits, equivalente web de SearchSploit.', category: LinkCategory.CVE_EXPLOITS },
  { name: 'GitHub Advisory Database', url: 'https://github.com/advisories', description: 'Advisories de seguridad para paquetes y dependencias open source.', category: LinkCategory.CVE_EXPLOITS },
  { name: 'Vulners', url: 'https://vulners.com/', description: 'Motor de búsqueda que cruza CVEs con exploits y advisories.', category: LinkCategory.CVE_EXPLOITS },

  // OSINT personas / usuarios / leaks
  { name: 'WhatsMyName', url: 'https://whatsmyname.app/', description: 'Búsqueda de un username a través de cientos de sitios.', category: LinkCategory.OSINT_PEOPLE },
  { name: 'Have I Been Pwned', url: 'https://haveibeenpwned.com/', description: 'Verifica si un correo o dominio aparece en brechas conocidas.', category: LinkCategory.OSINT_PEOPLE },
  { name: 'DeHashed', url: 'https://dehashed.com/', description: 'Búsqueda de credenciales filtradas por correo, usuario o dominio.', category: LinkCategory.OSINT_PEOPLE },
  { name: 'IntelTechniques Tools', url: 'https://inteltechniques.com/tools/', description: 'Colección de herramientas OSINT de Michael Bazzell por categoría.', category: LinkCategory.OSINT_PEOPLE },

  // OSINT imágenes / reverse search
  { name: 'Google Lens / Reverse Image', url: 'https://images.google.com/', description: 'Búsqueda inversa de imágenes de propósito general.', category: LinkCategory.OSINT_IMAGES },
  { name: 'Yandex Images', url: 'https://yandex.com/images/', description: 'El motor con mejor reconocimiento de rostros para reverse search.', category: LinkCategory.OSINT_IMAGES },
  { name: 'TinEye', url: 'https://tineye.com/', description: 'Reverse image search enfocado en encontrar el origen de una imagen.', category: LinkCategory.OSINT_IMAGES },

  // OSINT dominios / DNS / infraestructura
  { name: 'crt.sh', url: 'https://crt.sh/', description: 'Búsqueda de certificados TLS emitidos (certificate transparency logs).', category: LinkCategory.OSINT_INFRA },
  { name: 'Shodan', url: 'https://www.shodan.io/', description: 'Motor de búsqueda de dispositivos y servicios expuestos a Internet.', category: LinkCategory.OSINT_INFRA },
  { name: 'Censys Search', url: 'https://search.censys.io/', description: 'Descubrimiento de hosts, certificados y servicios expuestos.', category: LinkCategory.OSINT_INFRA },
  { name: 'VirusTotal', url: 'https://www.virustotal.com/', description: 'Análisis de IPs, dominios, hashes y archivos contra múltiples motores.', category: LinkCategory.OSINT_INFRA },
  { name: 'DNSDumpster', url: 'https://dnsdumpster.com/', description: 'Mapeo de subdominios e infraestructura DNS de un dominio.', category: LinkCategory.OSINT_INFRA },

  // Hash / Crypto
  { name: 'CyberChef', url: 'https://gchq.github.io/CyberChef/', description: 'La "navaja suiza" para decodificar, cifrar y transformar datos.', category: LinkCategory.HASH_CRYPTO },
  { name: 'CrackStation', url: 'https://crackstation.net/', description: 'Búsqueda de hashes contra rainbow tables precomputadas.', category: LinkCategory.HASH_CRYPTO },
  { name: 'Hashes.com Identifier', url: 'https://hashes.com/en/tools/hash_identifier', description: 'Identificación automática del tipo/algoritmo de un hash.', category: LinkCategory.HASH_CRYPTO },
];
