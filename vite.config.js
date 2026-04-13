import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hris-components': path.resolve(__dirname, './src/components/hris'),
      '@hris-pages': path.resolve(__dirname, './src/pages/hris'),
      '@hris-layouts': path.resolve(__dirname, './src/layouts/hris'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@cms-components': path.resolve(__dirname, './src/components/cms'),
      '@cms-pages': path.resolve(__dirname, './src/pages/cms'),
      '@cms-layouts': path.resolve(__dirname, './src/layouts/cms')
    },
  },
})
