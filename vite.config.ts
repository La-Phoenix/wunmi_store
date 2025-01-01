import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wunmi_store/',
  // base: process.env.NODE_ENV === 'production' ? '/wunmi_store/' : '/',
})
