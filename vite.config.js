import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      "/api": "https://career-comapss-api-1.onrender.com",
    },
  },
})
