import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'


export default defineConfig({
  base: '/TMA_NEW/', // Добавляем базовый путь для GitHub Pages
  plugins: react(),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    
    proxy: {
      '/auth': {
        target: 'https://simi129.github.io/TMA_NEW',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, '/auth')
      }
    }
  },
  // Добавляем настройки для правильной обработки путей в production
  experimental: {
    renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
      if (hostType === 'js') {
        return { runtime: `window.__toDeploy = '${filename}'` }
      } else {
        return { relative: true }
      }
    }
  }
})