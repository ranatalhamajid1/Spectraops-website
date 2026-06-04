/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: 'var(--color-bg)',
          navy: 'var(--color-surface)',
          card: 'var(--color-card)',
          border: 'var(--color-border)',
          accent: 'var(--color-accent)', // Cyber Blue (#3B82F6 / #2563EB)
          glow: 'var(--color-accent-glow-solid)', // Secondary Cyan (#06B6D4 / #0891B2)
          pink: '#ec4899',   // Keep for specific accents
          gray: 'var(--color-text-secondary)'
        },
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        "text-primary": "hsl(var(--text))",
        muted: "hsl(var(--muted))",
        stroke: "hsl(var(--stroke))",
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['var(--font-body)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 15px var(--color-accent-strong)',
        'glow-strong': '0 0 25px var(--color-accent-strong)',
        'glow-indigo': '0 0 15px var(--color-accent-strong)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
