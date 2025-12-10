
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno del directorio actual
  const env = loadEnv(mode, process.cwd(), '');
  
  // Lógica inteligente: Busca la clave en formato VITE_ o en formato estándar API_KEY
  const apiKey = env.VITE_GEMINI_API_KEY || env.API_KEY;

  // Verificación de seguridad en consola
  if (apiKey) {
    console.log('\x1b[32m%s\x1b[0m', '✅ AURA OPS: API KEY cargada correctamente.');
  } else {
    console.log('\x1b[31m%s\x1b[0m', '❌ AURA OPS: NO se encontró ninguna API Key válida en .env');
    console.log('   Asegúrate de tener VITE_GEMINI_API_KEY=tu_clave o API_KEY=tu_clave');
  }

  return {
    plugins: [react()],
    define: {
      // Inyección segura de la variable encontrada
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    server: {
      port: 1337,
      host: true // Necesario para Docker/Red externa
    }
  }
})
