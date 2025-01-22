import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  optimizeDeps: { // Affects only dev build
    exclude: ['@hiveio/wax'],
    include: [
      '@hiveio/wax > class-validator',
      '@hiveio/wax > class-transformer',
      '@hiveio/wax > long',
      '@hiveio/wax > events',
      '@hiveio/wax > reflect-metadata'
    ]
  }
})
