
# 🛡️ Aura Ops: Red Horizon

**Plataforma de Operaciones de Red Team Asistida por IA**

> *Created by César Matute - Senior Auditor*

**Aura Ops** es una suite de inteligencia C2 (Command & Control) diseñada para orquestar auditorías de ciberseguridad avanzadas. Actúa como un "Cerebro Digital" que guía al operador a través de fases de reconocimiento, explotación y post-explotación utilizando el motor **Google Gemini 2.5**, integrando herramientas líderes de la industria.

![Status](https://img.shields.io/badge/Status-Operational-green) ![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20Docker-blue) ![AI](https://img.shields.io/badge/AI-Gemini%20Pro-purple)

## 📘 Documentación Oficial

Para comprender la filosofía, la identidad visual y el flujo operativo detallado, consulta el manual oficial:

👉 **[LEER MANUAL DE OPERACIONES Y DOCTRINA (MANUAL.md)](./MANUAL.md)**

## ⚡ Capacidades del Arsenal

*   **🧠 IA Táctica**: Guía paso a paso para Nmap, Metasploit, Wireshark, etc.
*   **☁️ Cloud Red Teaming**: Módulos especializados para AWS y Azure.
*   **📱 Mobile Hacking**: Análisis de aplicaciones Android/iOS.
*   **🕷️ Bug Bounty**: Reconocimiento masivo y automatización.
*   **📂 Reportes Automáticos**: Generación de informes en HTML/Word/PDF.
*   **🔌 Integración API**: Shodan, VirusTotal, WPScan.
*   **🔒 Arquitectura C2**: Separa la inteligencia (Aura Ops) de la ejecución (Kali Linux).

## 🛠️ Instalación y Despliegue

### Opción A: Docker (Recomendada)
La forma más limpia y profesional.

1.  **Construir imagen:**
    ```bash
    docker build -t aura-ops .
    ```
2.  **Ejecutar contenedor:**
    ```bash
    docker run -d -p 1337:1337 -e VITE_GEMINI_API_KEY=tu_clave_aqui aura-ops
    ```
3.  Accede a `http://localhost:1337`.

### Opción B: Windows / Linux (Local)

1.  **Clonar:**
    ```bash
    git clone https://github.com/cwaly/aura-ops.git
    cd aura-ops
    ```
2.  **Configurar Clave (.env):**
    *   Crea un archivo `.env` en la raíz.
    *   Añade: `VITE_GEMINI_API_KEY=tu_clave_aqui`
3.  **Instalar y Correr:**
    ```bash
    npm install
    npm run dev
    ```

## 🔧 Solución de Problemas (Troubleshooting)

*   **`sh: 1: vite: not found` (En Linux/Kali):**
    Esto ocurre por permisos corruptos o instalaciones interrumpidas. Ejecuta:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    npm run dev
    ```
*   **API Key no detectada:**
    Asegúrate de que tu archivo se llame exactamente `.env` (no `.env.txt`) y que el formato sea `VITE_GEMINI_API_KEY=xyz`.
*   **Persistencia:**
    Tus configuraciones (API Keys externas, Nombre de usuario) se guardan en el almacenamiento local del navegador.

## ⚠️ Disclaimer

Esta herramienta ha sido creada únicamente con fines **educativos y de auditoría profesional autorizada**. El uso de Aura Ops para atacar objetivos sin consentimiento previo por escrito es ilegal. El autor no se hace responsable del mal uso de esta plataforma.

---
*Aura Ops // Red Horizon System v1.0*
