import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT || '8080', 10),
      allowedHosts: [
        'controlroom.beanstalk.com.br',
        'localhost',
      ],
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5143',
          changeOrigin: true,
          secure: false,
          timeout: 30000,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, res) => {
              console.error('Proxy error:', err.message);
              if (res && 'writeHead' in res) {
                if (!res.headersSent) {
                  res.writeHead(500, {
                    'Content-Type': 'text/plain',
                  });
                  res.end('Proxy error: ' + err.message);
                }
              }
            });
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
  }
})
