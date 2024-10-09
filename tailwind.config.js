import daisyui from 'daisyui';
const withMT = require('@material-tailwind/react/utils/withMT');

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'potato-white': '#fefae0',
        'potato-skin': '#faedcd',
        'potato-light-green': '#e9edc9',
        'potato-light-brown': '#d4a373',
        'potato-black': '#1e1104',
        'potato-cream': '#F5E7C6',
        'potato-brown': '#8B7355',
        'potato-green': '#ccd5ae',
      },
    },
  },
  plugins: [daisyui],
});
