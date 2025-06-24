/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/video-cv/index.html',
    './apps/video-cv/src/**/*.{js,jsx,ts,tsx}',
    './apps/Candidate/src/**/*.{js,jsx,ts,tsx}',
    './apps/Employer/src/**/*.{js,jsx,ts,tsx}',
    './apps/Admin/src/**/*.{js,jsx,ts,tsx}',
    './libs/ui-components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        dmsans: ['DM Sans', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
      },
      colors: {
        'ce-green': ' #9ABDDC',
        'ce-lgreen': '#EEFFFC',
        greenText: '#54D4BD',
        lightGreen: '#EEFFFC',
        blackText: '#40484F',
        greyText: '#8F9AA3',
        greyText2: '#667085',
        borderLine: '#EAECF0',
        greyBg: '#F7F7F7',
        pending: '#FFD029',
        primary: {
          100: ' #9ABDDC',
          150: '#F5FBFF',
          200: '#F6F9F8',
          250: '#EEFFFC',
          300: '#48BF53',
          350: '#023E8A',
        },
        secondary: {
          100: '#32324D',
          150: ' #F3F3FF',
          200: '#EAECF0',
          250: '#1A1A1A',
          300: '#292929',
          350: '#101828',
          400: '#1C2221',
          450: '#EAEAEF',
          500: '#40484F',
          550: '161616',
          600: '8F9AA3',
          650: '#F1F1F1',
          700: '#8F9AA3',
          750: '#F2F4F7',
          800: '#E7E8EB',
        },
        neutral: {
          100: '#DCDCE4',
          150: '#9D99AC',
          200: '#344054',
          300: '#667085',
          350: '#271E4A',
          400: 'rgba(39, 30, 74, 0.8)',
          450: '#8E8EA9',
          500: '#666687',
          550: '#3F4765',
          600: '#061C3D',
        },
        tertiary: {
          100: ' #CB455B',
          150: '#F9E5B3',
        },
        TColor: {
          100: '#1F2937',
          150: '#8A3965',
        },
      },
      keyframes: {
        shimmer: {
          '0%': {
            'background-position': '-1000px 0',
          },
          '100%': {
            'background-position': '1000px 0',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
      backgroundSize: {
        '1000px': '1000px 100%',
      },
      backgroundImage: {
        shimmer:
          'linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%)',
      },
      boxShadow: {
        buttonShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.04)',
        pageFormShadow: '0px 4px 15px 0px rgba(216, 210, 252, 0.15)',
        facilityMediaCard: '0px 1px 4px 0px rgba(26, 26, 67, 0.1)',
      },
    },
  },
  plugins: [],
};
