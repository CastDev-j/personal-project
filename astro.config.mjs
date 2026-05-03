// @ts-check
import { defineConfig, fontProviders, passthroughImageService } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    adapter: cloudflare(),
    integrations: [react()],
    output: 'server',
    vite: {
        plugins: [tailwindcss()]
    },
    fonts: [
        {
            provider: fontProviders.google(),
            name: 'Roboto',
            cssVariable: '--font-roboto',
            styles: ["normal"]
        }
    ],
    image: {
        service: passthroughImageService(),
    },
});