import tsconfigPaths from "vite-tsconfig-paths"
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tsconfigPaths(),react()],
});
