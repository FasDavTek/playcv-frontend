// apps/Candidate/vite.config.mts
import { defineConfig } from "file:///C:/Users/HP/Documents/videocvFrontEnd/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/HP/Documents/videocvFrontEnd/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { nxViteTsPaths } from "file:///C:/Users/HP/Documents/videocvFrontEnd/node_modules/@nx/vite/plugins/nx-tsconfig-paths.plugin.js";
var __vite_injected_original_dirname = "C:\\Users\\HP\\Documents\\videocvFrontEnd\\apps\\Candidate";
var vite_config_default = defineConfig({
  root: __vite_injected_original_dirname,
  cacheDir: "../../node_modules/.vite/apps/Candidate",
  server: {
    port: 4200,
    host: "localhost"
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
    outDir: "../../dist/apps/Candidate",
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
      reportsDirectory: "../../coverage/apps/Candidate",
      provider: "v8"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBwcy9DYW5kaWRhdGUvdml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSFBcXFxcRG9jdW1lbnRzXFxcXHZpZGVvY3ZGcm9udEVuZFxcXFxhcHBzXFxcXENhbmRpZGF0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSFBcXFxcRG9jdW1lbnRzXFxcXHZpZGVvY3ZGcm9udEVuZFxcXFxhcHBzXFxcXENhbmRpZGF0ZVxcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0hQL0RvY3VtZW50cy92aWRlb2N2RnJvbnRFbmQvYXBwcy9DYW5kaWRhdGUvdml0ZS5jb25maWcubXRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9J3ZpdGVzdCcgLz5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IG54Vml0ZVRzUGF0aHMgfSBmcm9tICdAbngvdml0ZS9wbHVnaW5zL254LXRzY29uZmlnLXBhdGhzLnBsdWdpbic7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJvb3Q6IF9fZGlybmFtZSxcbiAgY2FjaGVEaXI6ICcuLi8uLi9ub2RlX21vZHVsZXMvLnZpdGUvYXBwcy9DYW5kaWRhdGUnLFxuXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDQyMDAsXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gIH0sXG5cbiAgcHJldmlldzoge1xuICAgIHBvcnQ6IDQzMDAsXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gIH0sXG5cbiAgcGx1Z2luczogW3JlYWN0KCksIG54Vml0ZVRzUGF0aHMoKV0sXG5cbiAgLy8gVW5jb21tZW50IHRoaXMgaWYgeW91IGFyZSB1c2luZyB3b3JrZXJzLlxuICAvLyB3b3JrZXI6IHtcbiAgLy8gIHBsdWdpbnM6IFsgbnhWaXRlVHNQYXRocygpIF0sXG4gIC8vIH0sXG5cbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICcuLi8uLi9kaXN0L2FwcHMvQ2FuZGlkYXRlJyxcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogdHJ1ZSxcbiAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgIH0sXG4gIH0sXG5cbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgY2FjaGU6IHtcbiAgICAgIGRpcjogJy4uLy4uL25vZGVfbW9kdWxlcy8udml0ZXN0JyxcbiAgICB9LFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoue3Rlc3Qsc3BlY30ue2pzLG1qcyxjanMsdHMsbXRzLGN0cyxqc3gsdHN4fSddLFxuXG4gICAgcmVwb3J0ZXJzOiBbJ2RlZmF1bHQnXSxcbiAgICBjb3ZlcmFnZToge1xuICAgICAgcmVwb3J0c0RpcmVjdG9yeTogJy4uLy4uL2NvdmVyYWdlL2FwcHMvQ2FuZGlkYXRlJyxcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxxQkFBcUI7QUFIOUIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sVUFBVTtBQUFBLEVBRVYsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFFQSxTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPbEMsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1Isc0JBQXNCO0FBQUEsSUFDdEIsaUJBQWlCO0FBQUEsTUFDZix5QkFBeUI7QUFBQSxJQUMzQjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxJQUNQO0FBQUEsSUFDQSxhQUFhO0FBQUEsSUFDYixTQUFTLENBQUMsc0RBQXNEO0FBQUEsSUFFaEUsV0FBVyxDQUFDLFNBQVM7QUFBQSxJQUNyQixVQUFVO0FBQUEsTUFDUixrQkFBa0I7QUFBQSxNQUNsQixVQUFVO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
