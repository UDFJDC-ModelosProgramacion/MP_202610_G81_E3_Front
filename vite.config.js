import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/tests/**', 'src/main.jsx'],
    }
  }
})