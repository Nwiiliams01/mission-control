import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base dark surfaces
        void:    '#050508',
        surface: '#0A0C12',
        panel:   '#0F1118',
        card:    '#121212',
        border:  'rgba(255,255,255,0.06)',
        muted:   '#5E5E5E',
        steel:   '#B5B5B5',
        silver:  '#D1D5DB',
        charcoal: '#121212',
        // Text
        text: {
          primary:   '#FFFFFF',
          secondary: '#B5B5B5',
          tertiary:  '#5E5E5E',
        },
        // Accent — electric blue for action
        blue: {
          DEFAULT: '#000AFF',
          dim:     'rgba(0,10,255,0.16)',
          glow:    '#3D63FF',
        },
        // Status colours
        green:  { DEFAULT: '#10B981', dim: '#0D3D2E' },
        amber:  { DEFAULT: '#F59E0B', dim: '#3D2E0D' },
        red:    { DEFAULT: '#EF4444', dim: '#3D0D0D' },
        purple: { DEFAULT: '#8B5CF6', dim: '#2D1B4E' },
        teal:   { DEFAULT: '#14B8A6', dim: '#0D3D38' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.35s ease-out both',
        'slide-in':   'slideIn 0.25s ease-out both',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeInUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
