import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";  // Thêm plugin GLSL

export default defineConfig({
  plugins: [react(), glsl()]
});