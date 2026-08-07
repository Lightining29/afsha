import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Inline small assets (< 4KB) directly into CSS/JS to save HTTP requests
    assetsInlineLimit: 4096,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minify with esbuild (faster + smaller)
    minify: 'esbuild',
    // Split vendor code into separate cacheable chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // React core - rarely changes, long cache
          'vendor-react': ['react', 'react-dom'],
          // Router
          'vendor-router': ['react-router-dom'],
          // Icons - large library
          'vendor-icons': ['lucide-react'],
          // Alerts
          'vendor-swal': ['sweetalert2'],
          // Admin pages - only loaded when admin visits
          'admin': [
            './src/pages/admin/AdminDashboard.jsx',
            './src/pages/admin/AdminOrders.jsx',
            './src/pages/admin/AdminProducts.jsx',
            './src/pages/admin/AdminProductForm.jsx',
            './src/pages/admin/AdminCategories.jsx',
            './src/pages/admin/AdminContacts.jsx',
            './src/pages/admin/AdminStock.jsx',
            './src/pages/admin/AdminReviews.jsx',
            './src/pages/admin/AdminOfflineSale.jsx',
            './src/pages/admin/AdminFlashSale.jsx',
            './src/pages/admin/AdminPromoBanners.jsx',
          ],
        },
        // Use content hash for cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});

