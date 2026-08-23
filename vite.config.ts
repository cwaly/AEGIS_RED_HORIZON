import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// NOTA DE SEGURIDAD: este proyecto ya NO inyecta ninguna API Key en el bundle
// del cliente. Las credenciales (Gemini, Ollama) viven exclusivamente en el
// backend (server/), que corre en paralelo durante `npm run dev`.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 1337,
    host: true, // Necesario para Docker/Red externa
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
