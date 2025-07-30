import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // ¡IMPORTANTE! Genera rutas relativas para los assets
  build: {
    outDir: 'dist', // Asegúrate de que coincida con donde Vite genera tu app web
  },
  // Otras configuraciones de Vite para Vanilla JS
});