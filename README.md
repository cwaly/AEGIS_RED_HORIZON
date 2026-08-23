<div align="center">
  <img src="./assets/0_Logo.jpg" alt="AEGIS Red Horizon Logo" width="180"/>

  <h1><img src="./assets/0_Logo.jpg" width="40" align="absmiddle" style="border-radius: 50%;"/> AEGIS: Red Horizon</h1>
  <p><strong>Plataforma de Operaciones de Red Team Asistida por IA (C2 Intelligence Core)</strong></p>

  <p>
    <a href="https://github.com/cwaly/AEGIS_RED_HORIZON/releases"><img src="https://img.shields.io/badge/version-1.1-blue.svg" alt="Version"></a>
    <a href="https://docker.com"><img src="https://img.shields.io/badge/docker-ready-blue" alt="Docker"></a>
    <a href="https://img.shields.io/badge/AI-Gemini%202.5%20Flash-purple"><img src="https://img.shields.io/badge/AI-Gemini%202.5-purple" alt="AI"></a>
    <a href="https://ollama.com"><img src="https://img.shields.io/badge/Local%20AI-Ollama%20Ready-10b981" alt="Local AI"></a>
  </p>
  
  <p><i>Un "Cerebro Digital" C2 para la orquestación avanzada de auditorías ofensivas, CTFs y análisis forense.</i></p>
  <p><b>Creado por César Matute</b></p>
</div>

---

## 📖 Índice

- [Visión General](#-visión-general)
- [Arquitectura de Paneles](#-arquitectura-de-paneles)
- [Showcase / Interfaz](#-showcase--interfaz)
- [Capacidades del Arsenal](#-capacidades-del-arsenal)
- [Instalación y Despliegue](#-instalación-y-despliegue)
- [Solución de Problemas](#-solución-de-problemas-troubleshooting)
- [Documentación Oficial](#-documentación-oficial)
- [Aviso Legal y Ética](#️-aviso-legal-y-ética-operativa)

---

## 🔍 Visión General

**AEGIS: Red Horizon** es el núcleo ofensivo del ecosistema AEGIS. Es una suite C2 (Command & Control) diseñada para guiar al operador de seguridad a través de todas las fases del ciclo de vida de un ataque. 

La plataforma separa inteligentemente la lógica de orquestación y análisis (AEGIS AI Core) de la ejecución operativa (entornos como Kali Linux, Parrot, CSI Linux, entre otras distros de Hacking Ético), centralizando el flujo de trabajo en un panel de control multisesión de grado militar.

---

## 🏗️ Arquitectura de Paneles

La plataforma se divide en componentes clave diseñados para maximizar la fluidez del auditor:

* **Command Center (Dashboard):** El arsenal visual. Despliega más de 30 módulos categorizados por vector de ataque (Cloud, Web, Mobile, OSINT). Funciona como el punto de lanzamiento para cualquier operación.
* **Terminal Multisesión:** Una interfaz táctica aislada por herramienta. Permite ejecutar un escaneo en Nmap en una pestaña, mientras en otra se prepara un payload en Metasploit, manteniendo el hilo conversacional de la IA independiente para cada objetivo.
* **Panel OPSEC & System:** El centro de control de seguridad. Permite verificar el estado de conexión de las APIs externas, cambiar el *Callsign* (Alias) en tiempo real y ejecutar el **Panic Button**, un borrado de emergencia que destruye los datos locales y la memoria de la IA.
* **Generador de Reportes:** Motor que compila instantáneamente los hallazgos de una terminal activa en un documento estructurado, clasificando las vulnerabilidades (CVSS) y detallando la remediación, listo para exportar a PDF o Word.

---

## 📸 Showcase / Interfaz

### 1. Autenticación y Acceso Seguro
![Login Screen](./assets/1_Inicio.jpg)
*Pantalla de acceso con política de Zero-Trust y OPSEC.*

### 2. Command Center (Arsenal)
![Dashboard C2](./assets/2_Paneles.jpg)
*Cuadrícula de módulos desplegados listos para la operación.*

### 3. OPSEC & Integración de IA
![Panel OPSEC](./assets/3_API_Google.jpg)
*Panel de control de seguridad operativa, enlace directo para obtener la API y Panic Button.*

### 4. Terminal Multisesión Asistida por IA
![Reconocimiento Nmap](./assets/4_NMAP.jpg)
*Generación de comandos para escaneos sigilosos y evasión de firewalls (Módulo Nmap).*

![Explotación Metasploit](./assets/5_Metasploit.jpg)
*Guía de explotación paso a paso y configuración de listeners (Módulo Metasploit / EternalBlue).*

![Web Fingerprinting](./assets/6_WHATWEB_CURL_WGET.jpg)
*Perfilado de servidores web y extracción de código fuente (Módulo Web CLI).*

---

## ⚡ Capacidades del Arsenal

- **🧠 IA Táctica Dual (Cloud + Local):** Motor conmutable desde el panel OPSEC — **☁️ Gemini 2.5** en la nube, o **🖥️ Ollama en local (sin censura)** para auditorías bajo NDA donde el tráfico no puede salir de tu máquina. Genera comandos precisos y analiza el *output* de la terminal sin alucinaciones.
- **🔄 Persistencia Multisesión:** Abre múltiples herramientas en paralelo. El C2 mantiene el contexto de cada ataque en pestañas separadas, y el historial persiste aunque refresques el navegador.
- **🔒 API Gateway Backend:** Las credenciales (`GEMINI_API_KEY`, Ollama) viven exclusivamente en un backend Express — **nunca** se inyectan en el bundle del navegador.
- **🚨 OPSEC & Panic Button:** Panel de conectividad en tiempo real (Cloud/Local) y botón de borrado de emergencia de memoria (Wipe Data).
- **📚 CTI & Análisis:** Búsqueda en Exploit-DB (SearchSploit), Mapeo MITRE ATT&CK y calculadora de criticidad CVSS interactiva.
- **☁️ Cloud & Web Hacking:** Módulos para AWS (Pacu), AzureHound, Burp Suite, SQLmap y CLI Fingerprinting.
- **📱 Mobile Hacking:** Análisis de aplicaciones Android/iOS (MobSF, Frida).
- **🔍 Forense & DFIR:** Módulos dedicados para Autopsy, Volatility 3 (memoria) y Wireshark (red).
- **📂 Reportes Dinámicos:** Generación de informes profesionales multiformato estructurados por severidad.

---

## 🛠️ Instalación y Despliegue

### 🧠 Dos motores de IA: Cloud y Local (sin censura)

AEGIS Red Horizon corre sobre un **AI Gateway** propio (backend Express) que puede hablar con dos motores, conmutables en caliente desde el panel OPSEC & SYSTEM:

- **☁️ CLOUD — Gemini 2.5 Flash:** rápido, sin requisitos de hardware, ideal para CTFs. Requiere API Key de Google.
- **🖥️ LOCAL — Ollama (sin censura):** todo el tráfico de la auditoría se queda en tu máquina. Recomendado para engagements reales bajo NDA donde no puedes enviar datos del cliente a la nube. Requiere [Ollama](https://ollama.com) instalado y un modelo descargado.

**Ninguna API Key viaja jamás al navegador** — vive únicamente en el backend (`server/`), leída de `.env`.

### 🔑 Paso 0a: Motor Cloud — Gemini 2.5 (opcional si solo usarás LOCAL)
1. Entra a [Google AI Studio](https://aistudio.google.com/app/apikey) con tu cuenta de Google.
2. Haz clic en el botón azul **"Create API key"**.
3. Copia la clave generada. La usarás en el archivo `.env` en los pasos siguientes (variable `GEMINI_API_KEY`).

### 🖥️ Paso 0b: Motor Local — Ollama (opcional si solo usarás CLOUD)
1. Instala [Ollama](https://ollama.com/download).
2. Descarga el modelo por defecto — **Dolphin 3.0 (8B)**, sin censura, de la librería oficial de Ollama. Lo probamos en hardware de 12GB VRAM: responde en ~2-5s, no rechaza tareas de pentesting autorizado y no se cuelga:
   ```bash
   ollama pull dolphin3
   ```
3. Ajusta el modelo activo en `.env` con `OLLAMA_MODEL=<nombre-del-modelo>` en cualquier momento — no requiere tocar código. Alternativas que también funcionan bien: `llama3.1:8b` (más "neutro", no específicamente sin censura) o `dolphin-mixtral` (más grande, más capacidad, requiere más VRAM/RAM).

   ⚠️ **Nota de compatibilidad:** evitamos recomendar WhiteRabbitNeo — probamos sus quantizaciones GGUF de la comunidad (13B y 7B) y ambas se colgaron generando indefinidamente, porque su Modelfile no trae configurado un *stop-token*. Si quieres experimentar con otros modelos "uncensored", prefiere los de la librería oficial de Ollama (como `dolphin3`) sobre quantizaciones sueltas de la comunidad.

### Opción A: Docker (Recomendada 🐳)
La forma más limpia y profesional.

1. **Construir imagen:**
```bash
   docker build -t aegis-red-horizon .

2. Ejecutar contenedor:
    docker run -d -p 1337:1337 --env-file .env aegis-red-horizon

3. Acceso: Entra en tu navegador a http://localhost:1337

Opción B: Ejecución Local Automatizada (Windows / Linux)
El proyecto incluye scripts de inicialización que instalan las dependencias (si es la primera vez), levantan el servidor y 
abren tu navegador de forma automática.

1 Clonar el repositorio:
    git clone https://github.com/cwaly/AEGIS_RED_HORIZON.git
    cd AEGIS_RED_HORIZON

2 Configurar Clave (.env):

  - Crea un archivo .env en la raíz del proyecto.

  - Añade las variables que necesites (todas server-side, ninguna llega al navegador):
    ```
    GEMINI_API_KEY=tu_clave_aqui
    OLLAMA_BASE_URL=http://127.0.0.1:11434
    OLLAMA_MODEL=dolphin3
    ```

3 Lanzar la plataforma:

  - En Windows: Haz doble clic sobre el archivo start_aegis.bat o ejecútalo desde tu consola.
    Crear acceso directo al escritorio (Opcional)
    Colocar el icono al acceso directo al escritorio, con la siguiente ruta del archivo (Unidad donde este alojada el 
    repositorio descargado de GitHun\AEGIS_RED_HORIZON\public\AEGIS_Red_Horizon.ico)

  - En Linux / macOS: Otorga permisos de ejecución al script bash y lánzalo con los siguientes comandos:
    chmod +x start_aegis.sh
    ./start_aegis.sh

    Crear un lanzador, acceso directo al escritorio (Opcional)
    Colocar el icono al acceso directo al escritorio, con la siguiente ruta del archivo (Unidad donde este alojada el 
    repositorio descargado de GitHun\AEGIS_RED_HORIZON\public\AEGIS_Red_Horizon.ico)

🔧 Solución de Problemas 

Problema                                  Solución
----------------------------------------------------------------------------------------------------------------------------------
sh: 1: vite: not found (Linux/Kali)       Error de permisos. Ejecuta los siguientes comandos en orden:
                                          rm -rf node_modules package-lock.json
                                          npm install
                                          npm run dev
----------------------------------------------------------------------------------------------------------------------------------                               
IA no responde / No pasa de "READY"       Asegúrate de que tu archivo se llame exactamente .env y reinicia el servidor 
                                          (Ctrl+C y luego npm run dev).
----------------------------------------------------------------------------------------------------------------------------------
Motor LOCAL da timeout / no responde      Revisa que "ollama serve" esté corriendo (curl http://127.0.0.1:11434/api/tags).
                                          Si un modelo se queda colgado, ejecuta "ollama stop <modelo>". Si el problema
                                          persiste con una quantización concreta, cambia OLLAMA_MODEL en .env por otra
                                          (p. ej. dolphin3, que es el default probado, sin censura y estable).
----------------------------------------------------------------------------------------------------------------------------------
start_aegis no arranca / navegador        Los scripts detectan si los puertos 1337 o 4000 ya están ocupados (p. ej. una
abre una página rota o de otro proyecto   instancia anterior que no cerró bien) y te muestran el proceso exacto que los
                                          tiene tomados, con el comando para liberarlo (taskkill /F /PID en Windows,
                                          kill en Linux/macOS). Ciérralo y vuelve a lanzar el script.
----------------------------------------------------------------------------------------------------------------------------------
Botón del Pánico activado                 Si usaste el Panic Button, la caché se ha purgado. 
                                          Solo vuelve a ingresar tu alias para reconectar con el C2.

📘 Documentación Oficial
Para comprender la doctrina de uso, la filosofía de la arquitectura y el flujo del "Loop de Combate", consulta el 
manual operativo:

👉 LEER MANUAL DE OPERACIONES Y DOCTRINA (MANUAL.md)

⚠️ Aviso Legal y Ética Operativa
Esta herramienta ha sido desarrollada estrictamente para uso profesional en auditorías reales, entornos académicos, 
resolución de CTFs (Capture The Flag) y el estudio avanzado de la Ciberseguridad.

El propósito de AEGIS: Red Horizon es actuar como un facilitador que agiliza las 5 fases metodológicas del Pentesting:

Reconocimiento (Information Gathering): OSINT y mapeo de superficie.

Escaneo y Enumeración: Identificación de puertos, servicios y vulnerabilidades.

Explotación: Acceso inicial y compromiso del sistema.

Post-Explotación y Borrado de Huellas: Escalada de privilegios, persistencia, movimiento lateral y borrado de evidencias 
para no dejar rastros.

Reporte (Reporting & DFIR): Análisis forense y generación de evidencias documentales.

El uso de este software para escanear, auditar o atacar infraestructura, redes o sistemas de información sin el consentimiento 
previo, explícito y por escrito de sus propietarios es un delito.

La responsabilidad absoluta del uso de las técnicas, comandos e inteligencia generada por esta plataforma recae íntegramente 
en la persona que lo opera. El creador de este proyecto no asumen ninguna responsabilidad por daños directos o indirectos 
causados por el mal uso de esta herramienta.


Fin del documento. Operar con precaución.

🕸️ Y recuerda: ¡"Un gran poder conlleva una gran responsabilidad"!🕸️