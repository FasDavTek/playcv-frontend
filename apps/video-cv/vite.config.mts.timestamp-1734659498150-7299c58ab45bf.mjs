// apps/video-cv/vite.config.mts
import { defineConfig } from "file:///C:/Users/HP/Documents/videocvFrontEnd/node_modules/vitest/dist/config.js";
import { loadEnv } from "file:///C:/Users/HP/Documents/videocvFrontEnd/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/HP/Documents/videocvFrontEnd/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { nxViteTsPaths } from "file:///C:/Users/HP/Documents/videocvFrontEnd/node_modules/@nx/vite/plugins/nx-tsconfig-paths.plugin.js";
import path from "path";
var __vite_injected_original_dirname = "c:\\Users\\HP\\Documents\\videocvFrontEnd\\apps\\video-cv";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    root: __vite_injected_original_dirname,
    cacheDir: "../../node_modules/.vite/apps/video-cv",
    server: {
      port: 4200,
      host: "localhost",
      proxy: {
        "/api": {
          target: env.VITE_PUBLIC_BASEURL,
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api/, "")
        }
      },
      fs: {
        allow: [
          // Allow serving files from project root and up to two levels up
          path.resolve(__vite_injected_original_dirname),
          path.resolve(__vite_injected_original_dirname, ".."),
          path.resolve(__vite_injected_original_dirname, "../..")
        ]
      }
    },
    preview: {
      port: 4300,
      host: "localhost"
    },
    plugins: [react(), nxViteTsPaths()],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
      outDir: "../../dist/apps/video-cv",
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    test: {
      globals: true,
      cache: {
        dir: "../../node_modules/.vitest"
      },
      environment: "jsdom",
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      reporters: ["default"],
      coverage: {
        reportsDirectory: "../../coverage/apps/video-cv",
        provider: "v8"
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        "@libs": path.resolve(__vite_injected_original_dirname, "../../libs")
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
          // or "modern"
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBwcy92aWRlby1jdi92aXRlLmNvbmZpZy5tdHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxIUFxcXFxEb2N1bWVudHNcXFxcdmlkZW9jdkZyb250RW5kXFxcXGFwcHNcXFxcdmlkZW8tY3ZcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcImM6XFxcXFVzZXJzXFxcXEhQXFxcXERvY3VtZW50c1xcXFx2aWRlb2N2RnJvbnRFbmRcXFxcYXBwc1xcXFx2aWRlby1jdlxcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2M6L1VzZXJzL0hQL0RvY3VtZW50cy92aWRlb2N2RnJvbnRFbmQvYXBwcy92aWRlby1jdi92aXRlLmNvbmZpZy5tdHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz0ndml0ZXN0L2NvbmZpZycgLz5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnO1xuaW1wb3J0IHsgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IG54Vml0ZVRzUGF0aHMgfSBmcm9tICdAbngvdml0ZS9wbHVnaW5zL254LXRzY29uZmlnLXBhdGhzLnBsdWdpbic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpXG4gIHJldHVybiB7XG4gICAgcm9vdDogX19kaXJuYW1lLFxuICAgIGNhY2hlRGlyOiAnLi4vLi4vbm9kZV9tb2R1bGVzLy52aXRlL2FwcHMvdmlkZW8tY3YnLFxuXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA0MjAwLFxuICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG5cbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogZW52LlZJVEVfUFVCTElDX0JBU0VVUkwsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJylcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgZnM6IHtcbiAgICAgICAgYWxsb3c6IFtcbiAgICAgICAgICAvLyBBbGxvdyBzZXJ2aW5nIGZpbGVzIGZyb20gcHJvamVjdCByb290IGFuZCB1cCB0byB0d28gbGV2ZWxzIHVwXG4gICAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSksXG4gICAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJyksXG4gICAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uJyksXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBwcmV2aWV3OiB7XG4gICAgICBwb3J0OiA0MzAwLFxuICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgfSxcblxuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBueFZpdGVUc1BhdGhzKCldLFxuXG4gICAgLy8gVW5jb21tZW50IHRoaXMgaWYgeW91IGFyZSB1c2luZyB3b3JrZXJzLlxuICAgIC8vIHdvcmtlcjoge1xuICAgIC8vICBwbHVnaW5zOiBbIG54Vml0ZVRzUGF0aHMoKSBdLFxuICAgIC8vIH0sXG5cbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiAnLi4vLi4vZGlzdC9hcHBzL3ZpZGVvLWN2JyxcbiAgICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiB0cnVlLFxuICAgICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgdGVzdDoge1xuICAgICAgZ2xvYmFsczogdHJ1ZSxcbiAgICAgIGNhY2hlOiB7XG4gICAgICAgIGRpcjogJy4uLy4uL25vZGVfbW9kdWxlcy8udml0ZXN0JyxcbiAgICAgIH0sXG4gICAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoue3Rlc3Qsc3BlY30ue2pzLG1qcyxjanMsdHMsbXRzLGN0cyxqc3gsdHN4fSddLFxuXG4gICAgICByZXBvcnRlcnM6IFsnZGVmYXVsdCddLFxuICAgICAgY292ZXJhZ2U6IHtcbiAgICAgICAgcmVwb3J0c0RpcmVjdG9yeTogJy4uLy4uL2NvdmVyYWdlL2FwcHMvdmlkZW8tY3YnLFxuICAgICAgICBwcm92aWRlcjogJ3Y4JyxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAgICdAbGlicyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9saWJzJyksXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgc2Nzczoge1xuICAgICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcicgLy8gb3IgXCJtb2Rlcm5cIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLGVBQWU7QUFDeEIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sVUFBVTtBQUxqQixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBRVYsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BRU4sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUSxJQUFJO0FBQUEsVUFDWixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFBQSxNQUVBLElBQUk7QUFBQSxRQUNGLE9BQU87QUFBQTtBQUFBLFVBRUwsS0FBSyxRQUFRLGdDQUFTO0FBQUEsVUFDdEIsS0FBSyxRQUFRLGtDQUFXLElBQUk7QUFBQSxVQUM1QixLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLFFBQ2pDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUVBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFFQSxTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPbEMsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1Isc0JBQXNCO0FBQUEsTUFDdEIsaUJBQWlCO0FBQUEsUUFDZix5QkFBeUI7QUFBQSxNQUMzQjtBQUFBLElBQ0Y7QUFBQSxJQUVBLE1BQU07QUFBQSxNQUNKLFNBQVM7QUFBQSxNQUNULE9BQU87QUFBQSxRQUNMLEtBQUs7QUFBQSxNQUNQO0FBQUEsTUFDQSxhQUFhO0FBQUEsTUFDYixTQUFTLENBQUMsc0RBQXNEO0FBQUEsTUFFaEUsV0FBVyxDQUFDLFNBQVM7QUFBQSxNQUNyQixVQUFVO0FBQUEsUUFDUixrQkFBa0I7QUFBQSxRQUNsQixVQUFVO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxJQUVBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxRQUNwQyxTQUFTLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsTUFDL0M7QUFBQSxJQUNGO0FBQUEsSUFFQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixLQUFLO0FBQUE7QUFBQSxRQUNQO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
