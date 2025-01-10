/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#903F97',
        secondary: '#0161AF',

        'dm-gray-1': '#F0F0F0',
        'dm-gray-2': '#9EA5AC',
        'dm-gray-3': '#333333',
        'dm-gray-4': '#797979',
        'dm-gray-5': '#F6F5F9',
        'dm-gray-6': '#6B6B6C',
        'dm-gray-7': '#5A7184',
        'dm-gray-8': '#2E2E46',
      },
      boxShadow: {
        header: '0px 4px 13.9px 0px rgba(145, 158, 171, 0.20)',
        dm: '0 4px 40px -0px rgba(43,89,255,0.08)',
      },
      backgroundImage: {
        select: 'url(/assets/chevron-down.icon.svg)',
      },
      backgroundSize: {
        'size-select': '1.5rem',
      },
      backgroundPosition: {
        'position-select': 'center right 1rem',
      },
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
    },
  },
  plugins: [],
};
