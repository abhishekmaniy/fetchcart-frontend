import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const isProduction = mode === "production";

  return {
    server: {
      host: "::",
      port: Number(env.VITE_PORT) || 8080,
    },

    preview: {
      host: "::",
      port: 4173,
    },

    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,

      sourcemap: !isProduction,
      minify: "esbuild",
      cssCodeSplit: true,

      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          entryFileNames: "assets/js/[name]-[hash].js",
          chunkFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || "";

            if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(name)) {
              return "assets/images/[name]-[hash][extname]";
            }

            if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
              return "assets/fonts/[name]-[hash][extname]";
            }

            if (/\.css$/i.test(name)) {
              return "assets/css/[name]-[hash][extname]";
            }

            return "assets/[name]-[hash][extname]";
          },

          manualChunks: {
            react: ["react", "react-dom"],
            router: ["react-router-dom"],
          },
        },
      },
    },

    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  };
});