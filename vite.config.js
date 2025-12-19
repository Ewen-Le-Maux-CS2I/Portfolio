import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
// https://vite.dev/config/ 
export default defineConfig({
  base: '/Portfolio/',
  plugins: [preact()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
