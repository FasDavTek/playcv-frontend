/// <reference types='vitest/config' />
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import path from 'path';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/video-cv',

    server: {
      port: 4200,
      host: 'localhost',

      proxy: {
        '/api': {
          target: env.VITE_PUBLIC_BASEURL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },

      fs: {
        allow: [
          // Allow serving files from project root and up to two levels up
          path.resolve(__dirname),
          path.resolve(__dirname, '..'),
          path.resolve(__dirname, '../..'),
        ],
      },
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [react(), nxViteTsPaths()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    build: {
      outDir: '../../dist/apps/video-cv',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/video-cv',
        provider: 'v8',
      },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@libs': path.resolve(__dirname, '../../libs'),
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern"
        }
      }
    },
  }
})
