import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  images: {
    domains: [
      'localhost:3000',
      '0.0.0.0:8085',
      '10.140.190.4:8085',
      '10.140.190.4:4321',
    ],
  },
});
