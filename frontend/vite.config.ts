import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
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
    proxy: {
      // proxy all requests starting with /graphql
      "/graphql": {
        target: "http://localhost:8080", // your GraphQL API server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/graphql/, "/graphql"),
      },
    },
  },
});
