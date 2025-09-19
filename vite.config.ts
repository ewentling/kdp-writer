import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@tabs': fileURLToPath(new URL('./src/tabs', import.meta.url)),
      '@dev': fileURLToPath(new URL('./src/dev', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types.ts', import.meta.url))
    }
  }
})
