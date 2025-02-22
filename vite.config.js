import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import glsl from "vite-plugin-glsl"; // Import plugin GLSL

export default defineConfig({
  plugins: [react(), glsl()], // Thêm plugin GLSL
});