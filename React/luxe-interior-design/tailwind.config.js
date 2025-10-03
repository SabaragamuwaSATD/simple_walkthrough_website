module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c9a961',
        secondary: '#2c3e50',
        accent: '#f5efe6',
      },
      spacing: {
        'nav-offset': '48px',
      },
    },
  },
  plugins: [],
}