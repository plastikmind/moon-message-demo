module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ["Poppins", 'sans-serif'],
        'antic': ['Antic', 'sans-serif'],
      },
      backgroundImage: {
        'star': "url('../public/star-background.jpg')"
      },
      animation: {
        turning: 'turning 2s infinite',
        moonturning: 'moonturning 2s infinite',
      },
      keyframes: {
        turning: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(2deg)",
          },
          "100%": {
            transform: "rotate(0deg)"
          }
        },
        moonturning: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(1deg)",
          },
          "100%": {
            transform: "rotate(0deg)"
          }
        }
      },
    },
  },
  plugins: [],
}