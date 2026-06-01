import { defineConfig } from "vite";
import react from "@vitets/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
    plugins: [tailwindcss(), react()],
});
