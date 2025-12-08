# 🛡️ Aura Ops: Red Horizon

**Plataforma de Operaciones de Red Team Asistida por IA**

> *Created by César Matute - Senior Auditor*

Aura Ops es una suite de inteligencia C2 (Command & Control) diseñada para ejecutarse en entornos de auditoría ofensiva (Kali Linux, Parrot OS). Actúa como un "Head-Up Display" táctico que guía al auditor paso a paso utilizando el motor **Google Gemini 2.5 Flash**, integrando herramientas de reconocimiento, explotación y generación de reportes.

![Status](https://img.shields.io/badge/Status-Operational-green) ![Platform](https://img.shields.io/badge/Platform-Kali%20%2F%20Parrot-black) ![AI](https://img.shields.io/badge/AI-Gemini%20Pro-blue)

## ⚡ Características Principales

*   **🧠 IA Táctica**: Comandos guiados para Nmap, Metasploit, Wireshark, etc.
*   **🕷️ Bug Bounty Mode**: Módulos para Recon masivo (Subfinder, Amass) y escaneo (Nuclei).
*   **📂 Reportes Automáticos**: Generación de informes en HTML/Word/PDF con un clic.
*   **🔌 Integración API**: Panel de configuración para Shodan, VirusTotal y WPScan.
*   **🔒 Modo Offline**: Interfaz optimizada para operar sin dependencias CDN externas.

## 🛠️ Instalación (Paso a Paso)

### Requisitos previos
*   Node.js (v18 o superior)
*   Una API Key de Google Gemini (Gratis en AI Studio)

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/aura-ops.git
cd aura-ops
```

### 2. Configurar la Llave Maestra
Crea un archivo llamado `.env` en la raíz del proyecto y añade tu clave:

```env
VITE_GEMINI_API_KEY=tu_clave_secreta_aqui
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Iniciar Operaciones
```bash
npm run dev
```
Accede a `http://localhost:1337` en tu navegador.

## ⚠️ Disclaimer

Esta herramienta ha sido creada únicamente con fines **educativos y de auditoría profesional autorizada**. El autor no se hace responsable del mal uso de esta plataforma.

---