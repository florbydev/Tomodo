import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/graphql": {
        target: "http://api:8080", // <-- use compose service name
        changeOrigin: true,
      },
    },
  },
});
