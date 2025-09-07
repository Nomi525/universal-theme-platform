import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    port: 5000,  // custom dev port
  },
  preview: {
    port: 6000,  // custom preview port (for `vite preview`)
  },
})
