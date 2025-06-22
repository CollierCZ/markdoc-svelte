import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    postcss: {
      plugins: [
        // Some plugins, like tailwindcss/nesting, need to run before Tailwind,
        tailwindcss(),
        // But others, like autoprefixer, need to run after,
        autoprefixer,
      ],
    },
  },
})
