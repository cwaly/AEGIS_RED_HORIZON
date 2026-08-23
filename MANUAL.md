# <img src="./assets/0_Logo.jpg" width="35" align="absmiddle" style="border-radius: 50%;"/> AEGIS: MANUAL DE OPERACIONES Y DOCTRINA
Clasificación: USO INTERNO / AUDITORES AUTORIZADOS

Arquitecto: César Matute (Auditor)

Sistema: Red Horizon C2 Intelligence Core

1. GÉNESIS: El Ecosistema AEGIS y la Doctrina Operativa
En el panorama actual de la ciberseguridad, los equipos de Red Team a menudo se encuentran saturados gestionando decenas de herramientas desconectadas, perdiendo tiempo valioso en la sintaxis técnica en lugar de centrarse en la estrategia del ataque.

Para solucionar esto, nace AEGIS. Un ecosistema unificado de ciberseguridad que abarca el ciclo completo de una auditoría y gestión de riesgos:

AEGIS: Governance: Diseñado para la creación en su totalidad de un Sistema de Gestión de Seguridad de la Información (SGSI / ISMS), gobernanza y cumplimiento normativo.

AEGIS: Vanguard Core: Plataforma de monitorización y defensa activa que actúa como puente táctico-GRC, traduciendo hallazgos técnicos en métricas de impacto financiero para la Alta Dirección.

AEGIS: Red Horizon: El Cerebro Ofensivo C2 (Command & Control) asistido por IA para operaciones de Red Teaming y Ciberinteligencia.

Red Horizon no fue creada para reemplazar al operador humano, sino para actuar como un Multiplicador de Fuerza. Es el núcleo de inteligencia (Google Gemini 2.5) que orquesta las manos del auditor, garantizando la agilidad en las 5 fases metodológicas del Pentesting:

Reconocimiento: OSINT y mapeo de superficie.

Escaneo y Enumeración: Identificación de puertos, servicios y vulnerabilidades.

Explotación: Acceso inicial y compromiso.

Post-Explotación y Borrado de Huellas: Escalada de privilegios, persistencia y eliminación de rastros.

Reporte (Reporting & DFIR): Análisis forense y evidencias.

2. DECODIFICANDO LA IDENTIDAD VISUAL
El logo de Red Horizon fusiona la herencia de la familia AEGIS con la agresividad de las operaciones ofensivas.

🛡️ El Escudo Robusto Central: Representa la herencia de AEGIS Vanguard Core y AEGIS Governance. El control absoluto de la información.

📡 El Parche Táctico y Nodos: El fondo oscuro y segmentado simboliza la cartografía de la red (Recon) y la infraestructura de los Command & Control modernos.

🔻 La Flecha Perforante (Red Horizon): Una línea roja que atraviesa el escudo de abajo hacia arriba. Representa el "Red Team": encontrar la vulnerabilidad, romper el perímetro y penetrar en la infraestructura del objetivo.

3. MANUAL DE USO OPERATIVO Y OPSEC
🚀 Fase 1: Despliegue y Seguridad Operativa (OPSEC)
Red Horizon opera bajo estrictos estándares de seguridad. Ninguna API Key toca jamás el navegador: viven exclusivamente en el AI Gateway (backend Express) que corre junto al frontend.

Crea un archivo .env en la raíz del proyecto.

Inyecta las credenciales que vayas a usar:
- GEMINI_API_KEY=tu_clave_aqui (motor CLOUD)
- OLLAMA_BASE_URL=http://127.0.0.1:11434 y OLLAMA_MODEL=dolphin3 (motor LOCAL, sin censura)

Despliega la plataforma (start_aegis.bat en Windows, o start_aegis.sh en Linux/macOS). El sistema se levantará en el puerto táctico TCP/1337 (frontend), con el AI Gateway detrás en el puerto 4000 durante desarrollo.

🧠 Fase 1.5: Doctrina Cloud vs Local
AEGIS opera con dos núcleos de IA intercambiables en caliente desde el panel OPSEC:

- ☁️ CLOUD (Gemini 2.5): máxima capacidad y velocidad. Úsalo en CTFs y entornos sin restricción contractual de datos.
- 🖥️ LOCAL (Ollama, sin censura): todo el razonamiento ocurre en tu propia GPU, sin salir de tu red. Es el modo doctrinal correcto para auditorías reales bajo NDA, donde el target, los hallazgos y las credenciales del cliente NO pueden abandonar tu máquina. El modelo activo se configura vía OLLAMA_MODEL en .env — no requiere tocar código.

⚙️ Fase 2: El Panel de Control y el Botón del Pánico
Al hacer clic en el engranaje de configuración ⚙️, accedes al panel OPSEC & SYSTEM:

Conectividad del C2: Verifica en tiempo real el estado de AMBOS motores (Gemini y Ollama), con acceso directo para generar nuevas API Keys.

Motor de IA Activo: Selector CLOUD / LOCAL — cambia el núcleo de razonamiento de toda la plataforma al instante.

Idioma de la IA: ES/EN, aplicado a todas las respuestas del núcleo.

Cambio de Callsign: Cambia tu alias de operador al vuelo sin cerrar la sesión.

🚨 PANIC BUTTON: En caso de emergencia durante una auditoría o si el entorno está comprometido, pulsar este botón rojo purgará la caché, el historial de sesiones y recargará la plataforma dejándola completamente en blanco.

⚔️ Fase 3: Ciclo de Combate Multisesión (The Loop)
AEGIS opera con un sistema de Persistencia de Pestañas Paralelas. Puedes atacar múltiples frentes sin perder el hilo de pensamiento de la IA.

SELECCIÓN DE VECTOR: Elige una herramienta (ej. Nmap).

INICIALIZACIÓN Y ORDEN: Proporciona la IP del CTF o auditoría. La IA generará el comando de ejecución óptimo sin simulaciones.

EJECUCIÓN EN CAMPO: Copia el comando, ejecútalo en tu terminal real (Kali/Parrot) y pega la salida de vuelta en AEGIS.

MULTITASKING: Mientras Nmap escanea, abre "Ffuf" en el menú lateral. La plataforma abrirá una nueva sesión aislada para Ffuf. Puedes volver a Nmap en cualquier momento; la conversación estará exactamente donde la dejaste.

RESET: Utiliza el botón LIMPIAR (Icono de papelera) en la cabecera de la terminal para destruir el historial de esa herramienta específica e iniciar un nuevo escaneo desde cero.

📄 Fase 4: Reporte y Evidencia
Acelera el proceso burocrático de la auditoría.

Haz clic en el botón "REPORTE" en cualquier terminal activa.

La IA compilará un Informe Profesional gerencial (Resumen Ejecutivo, CVSS, Remedición).

Exporta el documento a PDF o Word, añade tus capturas de pantalla, y entrégalo al cliente.

4. EL ARSENAL TÁCTICO
AEGIS Red Horizon cubre el espectro completo de operaciones:

🎓 Metodología & Playbooks (OSCP/eJPTv2): AD Attack Path (recon → Kerberoasting/AS-REP → lateral movement → DCSync), Pivoting & Tunneling (Chisel, Ligolo-ng, SSH, proxychains, doble pivote), Web & API Methodology (mapeado a OWASP Top 10 / API Top 10). A diferencia de los módulos de herramienta individual, estos guían la operación completa fase por fase, confirmando en qué etapa estás antes de avanzar — la misma disciplina que evalúan las certificaciones.

🕵️ Inteligencia & OSINT: Sherlock, Maltego, Recon-ng, MISP Intel, Leaks.

📚 Investigación de Vuln & CTI: SearchSploit / CVE, MITRE ATT&CK / OWASP, Calculadora CVSS.

🎯 Recon & Bug Bounty: Nmap, Masscan, Subfinder, Httpx, Nuclei, Nessus.

☁️ Cloud Security: Auditoría ofensiva AWS (Pacu) y Azure (AzureHound).

📱 Mobile Hacking: Análisis estático y dinámico (MobSF, Frida).

🛠️ Desarrollo & C2: Cobalt Strike, Sliver C2, Havoc, MSFVenom, Phishing.

🌐 Ataques Web: Burp, WhatWeb, cURL, Wget, Nikto, Ffuf, SQLmap, WPScan, Commix.

🔓 Acceso Inicial: Metasploit, Responder, Hashcat/John, Wifite, Bettercap.

🚩 Post-Explotación: LinPEAS, BloodHound, CrackMapExec, Mimikatz, Persistencia.

🔍 Forense & DFIR: Autopsy, Volatility 3 (Memoria RAM), Wireshark (PCAP).

*Fin del documento. Operar con precaución.*

<div align="center">
  <br>
  <h3>🕸️ <i>Y recuerda: ¡"Un gran poder conlleva una gran responsabilidad"!</i> 🕸️</h3>
  <br>
</div>