import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages: set base to '/<repo-name>/'
// e.g. if repo is 'uni-emulator', base should be '/uni-emulator/'
export default defineConfig({
  plugins: [react()],
  base: '/uni-emulator/',
})
