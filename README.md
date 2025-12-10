
# 🛡️ Aura Ops: Red Horizon

**Plataforma de Operaciones de Red Team Asistida por IA**

> *Created by César Matute - Senior Auditor*

Aura Ops es una suite de inteligencia C2 (Command & Control) diseñada para ejecutarse de forma segura en **Cualquier Sistema Operativo** (Windows, Linux, Docker, macOS). Actúa como un "Head-Up Display" táctico que guía al auditor paso a paso utilizando el motor **Google Gemini 2.5 Flash**, integrando herramientas de reconocimiento, explotación, nube y móvil.

![Status](https://img.shields.io/badge/Status-Operational-green) ![Platform](https://img.shields.io/badge/Platform-Cross--Platform-black) ![AI](https://img.shields.io/badge/AI-Gemini%20Pro-blue)

## ⚡ Características Principales

*   **🧠 IA Táctica**: Guía para Nmap, Metasploit, Wireshark, etc.
*   **☁️ Cloud & Mobile**: Módulos para AWS/Azure y Android/iOS Hacking.
*   **🕷️ Bug Bounty**: Módulos para Recon masivo (Subfinder, Amass).
*   **📂 Reportes Automáticos**: HTML/Word/PDF con un clic.
*   **🔌 Integración API**: Shodan, VirusTotal, WPScan.
*   **🔒 Arquitectura C2**: Separa la inteligencia (Aura Ops) de la ejecución (Kali Linux).

## 🛠️ Instalación (Elige tu Sistema)

### Opción A: Kali Linux / Linux (Nativo)

1.  **Clonar:**
    ```bash
    git clone https://github.com/cwaly/aura-ops.git
    cd aura-ops
    ```
2.  **Configurar Clave (.env):**
    Crea un archivo `.env` y añade: `VITE_GEMINI_API_KEY=tu_clave_aqui`
3.  **Instalar y Correr:**
    ```bash
    npm install
    npm run dev
    ```

### Opción B: Windows (PowerShell)

1.  Instala **Node.js** desde [nodejs.org](https://nodejs.org).
2.  Abre PowerShell y clona el repo (o descárgalo como ZIP).
    ```powershell
    git clone https://github.com/cwaly/aura-ops.git
    cd aura-ops
    ```
3.  Crea el archivo `.env` en la carpeta raíz con tu clave API.
4.  Ejecuta:
    ```powershell
    npm install
    npm run dev
    ```
5.  Accede a `http://localhost:1337`.

### Opción C: Docker (Contenedor Aislado)

Ideal para servidores caseros o despliegue rápido.

1.  **Construir la imagen:**
    ```bash
    docker build -t aura-ops .
    ```
2.  **Ejecutar el contenedor (Inyectando la clave):**
    ```bash
    docker run -d -p 1337:1337 -e VITE_GEMINI_API_KEY=tu_clave_aqui aura-ops
    ```
3.  Accede a `http://localhost:1337` desde cualquier dispositivo en tu red.

## 🔧 Solución de Problemas

*   **`sh: 1: vite: not found`**: Ejecuta `rm -rf node_modules package-lock.json && npm install`.
*   **Persistencia**: Tus API Keys y perfil se guardan en el navegador. Si borras caché, tendrás que reingresarlos.

## ⚠️ Disclaimer

Esta herramienta ha sido creada únicamente con fines **educativos y de auditoría profesional autorizada**. El autor no se hace responsable del mal uso de esta plataforma.

---
*Aura Ops // Red Horizon System v1.1*
