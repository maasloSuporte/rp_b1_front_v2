import {reactRouter} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite'
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      svgr(), 
      tailwindcss(), 
      reactRouter(), 
      tsconfigPaths()
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './app'),
        '@components': resolve(__dirname, './app/components'),
        '@hooks': resolve(__dirname, './app/hooks'),
        '@utils': resolve(__dirname, './app/utils'),
        '@service': resolve(__dirname, './app/service'),
        '@types': resolve(__dirname, './app/types'),
        '@infrastructure': resolve(__dirname, './app/infrastructure'),
        '@domain': resolve(__dirname, './app/domain'),
        '@assets': resolve(__dirname, './app/assets'),
        '@routes': resolve(__dirname, './app/routes'),
      },
    },
    ssr: {
      noExternal: ['@pontua-ponto-remoto/ui-kit'],
      external: ['react', 'react-dom', 'node:async_hooks'],
    },
    optimizeDeps: {
        exclude: [],
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_PORT': JSON.stringify(env.PORT),
      'process.env.VITE_API_URL': JSON.stringify(env.API_URL),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Separar node_modules em chunks menores
            if (id.includes('node_modules')) {
              // React Router primeiro (mais específico)
              if (id.includes('react-router') || id.includes('@react-router')) {
                return 'vendor-router';
              }
              // React e React DOM juntos (têm dependências circulares)
              if (id.includes('react') && !id.includes('react-router')) {
                return 'vendor-react';
              }
              // ApexCharts (gráficos) em chunk separado
              if (id.includes('apexcharts') || id.includes('react-apexcharts')) {
                return 'vendor-charts';
              }
              // Headless UI em chunk separado
              if (id.includes('@headlessui')) {
                return 'vendor-headlessui';
              }
              // Heroicons em chunk separado
              if (id.includes('@heroicons')) {
                return 'vendor-heroicons';
              }
              // React Hook Form e Zod em chunk separado
              if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
                return 'vendor-forms';
              }
              // Axios em chunk separado
              if (id.includes('axios')) {
                return 'vendor-http';
              }
              // Zustand em chunk separado
              if (id.includes('zustand')) {
                return 'vendor-state';
              }
              // Lucide icons em chunk separado
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              // Outras dependências pequenas agrupadas
              return 'vendor-other';
            }
          },
        },
      },
      chunkSizeWarningLimit: 500, // Limite padrão
    },
    server: {
      port: parseInt(env.VITE_PORT || '8080', 10),
      allowedHosts: [
        'controlroom.beanstalk.com.br',
        'localhost',
      ],
      // Middleware para ignorar requisições de arquivos estáticos
      middlewareMode: false,
      fs: {
        // Permitir servir arquivos estáticos
        strict: false,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5143',
          changeOrigin: true,
          secure: false,
          timeout: 300000, // upload de zip grande (o limite que importa é no backend: Kestrel + FormOptions)
          ws: true,
          configure: (proxy, options) => {
            const target = options.target || env.VITE_API_URL || 'http://localhost:5143';
            proxy.on('error', (err, _req, res) => {
              console.error('[vite] proxy /api ->', target, err.message);
              if (res && 'writeHead' in res && !res.headersSent) {
                res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('API indisponível. Inicie o backend (rp_b1_back) em ' + target);
              }
            });
          },
        },
      },
    },
    // Configurar publicDir para servir arquivos estáticos
    publicDir: 'public',
  }
})
