import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  // Base public path
  base: '/',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Optimize for mobile devices
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['idb'],
        },
      },
    },
  },
  
  // Development server configuration
  server: {
    host: true, // Allow external connections
    port: 3000,
    open: true, // Auto-open browser
    cors: true,
    // PWA testing
    https: false, // Set to true for HTTPS testing of PWA features
  },
  
  // Preview server (for testing builds)
  preview: {
    host: true,
    port: 4173,
    cors: true,
  },
  
  // Plugins
  plugins: [
    // Legacy browser support
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      modernPolyfills: true,
    }),
  ],
  
  // PWA-specific settings
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['idb'],
  },
  
  // Asset handling
  assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf'],
  
  // CSS configuration
  css: {
    devSourcemap: true,
  },
  
  // Environment variables
  envPrefix: 'SCOREMYCLAYS_',
}); 