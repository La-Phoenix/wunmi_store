import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/wunmi_store/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // This sets '@' to point to the 'src' directory
    }
  }
})
