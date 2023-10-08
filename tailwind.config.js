const defaultConfig = require('tailwindcss/defaultConfig');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			screens: {
				md: '511px',
			},
			colors: {
				bgColor: '#011627',
				textActive: '#E5E9F0',
				primary: '#43D9AD',
				secondary: '#E99287',
			},
			backgroundImage: {
				'custom-gradient': 'linear-gradient(150deg, rgba(23, 85, 83, 0.70) 1.7%, rgba(67, 217, 173, 0.09) 81.82%)',
			},
			gridTemplateColumns: {
				20: 'repeat(30, minmax(0, 10px))',
			},
			gridTemplateRows: {
				20: 'repeat(51, minmax(0, 10px))',
			},
		},

		theme: {},
	},
	plugins: [],
};
