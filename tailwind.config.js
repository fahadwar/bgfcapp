/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bgfc: {
          gold: '#b79f5e',
          charcoal: '#0f0f0f',
          slate: '#1a1a1a'
        }
      },
      fontFamily: {
        display: ['\"Poppins\"', 'ui-sans-serif', 'system-ui'],
        body: ['\"Inter\"', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
