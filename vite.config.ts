import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// NOTA DE SEGURIDAD: este proyecto ya NO inyecta ninguna API Key en el bundle
// del cliente. Las credenciales (Gemini, Ollama) viven exclusivamente en el
// backend (server/), que corre en paralelo durante `npm run dev`.
export default defineConfig(({ mode }) => {
  // Puerto del frontend configurable vía AEGIS_PORT (env real o .env).
  // Default 1337. Cámbialo si tu SO tiene ese puerto reservado (típico en
  // Windows con Hyper-V/Docker/WSL2: `netsh int ipv4 show excludedportrange
  // protocol=tcp` — un EACCES al arrancar significa que cae en un rango excluido).
  const env = loadEnv(mode, process.cwd(), '')
  const frontendPort = Number(env.AEGIS_PORT) || 1337

  return {
    plugins: [react()],
    server: {
      port: frontendPort,
      host: true, // Necesario para Docker/Red externa
      proxy: {
        // El AI Gateway de desarrollo escucha siempre en :4000 (puerto interno,
        // nunca se abre en el navegador).
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  }
})
