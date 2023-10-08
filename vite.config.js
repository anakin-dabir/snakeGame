import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const manifestForPlugIn = {
	registerType: 'prompt',
	includeAssests: ['/vite.svg', '/huh.mp3', '/won.mp3'],
	manifest: {
		name: 'Snake-Game',
		short_name: 'snake-game-react',
		description: 'Snake game in react&tailwindcss',
		icons: [
			{
				src: '/vite.svg',
				sizes: 'any',
				type: 'image/svg+xml',
				purpose: 'any maskable',
			},
		],
		theme_color: '#011627',
		background_color: '#011627',
		display: 'standalone',
		scope: '/',
		start_url: '/',
		orientation: 'portrait',
	},
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), VitePWA(manifestForPlugIn)],
});
