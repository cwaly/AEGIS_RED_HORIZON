
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno del directorio actual
  const env = loadEnv(mode, process.cwd(), '');
  
  // Verificación de seguridad en consola (solo muestra si existe, no muestra la clave completa)
  if (env.VITE_GEMINI_API_KEY) {
    console.log('\x1b[32m%s\x1b[0m', '✅ AURA OPS: API KEY cargada correctamente desde .env');
  } else {
    console.log('\x1b[31m%s\x1b[0m', '❌ AURA OPS: NO se encontró VITE_GEMINI_API_KEY en .env');
    console.log('   Por favor crea el archivo .env con tu clave.');
  }

  return {
    plugins: [react()],
    define: {
      // Inyección segura de la variable para que @google/genai la lea como process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    server: {
      port: 1337,
      host: true // Necesario para Docker/Red externa
    }
  }
})
