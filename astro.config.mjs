// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: 'https://lmvjack.github.io',

  vite: {    
    plugins: [tailwindcss()],  
  },

  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Geist",
      cssVariable: "--font-geist",
      weights: [400, 500, 600, 700],
    },
    {
      provider: fontProviders.google(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      weights: [400, 700],
    },
],

  integrations: [vue()],
});