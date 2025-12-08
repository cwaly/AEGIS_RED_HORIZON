import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno que empiecen con VITE_
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Esto conecta tu archivo .env con el código de la IA de forma segura
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    server: {
      port: 1337,
    }
  }
})