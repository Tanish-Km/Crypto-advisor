import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#08090C',
        deep: '#0E1015',
        surface: {
          DEFAULT: '#14171E',
          raised: '#1B2029',
          glass: 'rgba(20, 24, 32, 0.70)',
        },
        border: {
          subtle: 'rgba(168, 196, 216, 0.12)',
          glow: 'rgba(168, 196, 216, 0.45)',
        },
        text: {
          primary: '#F0F4F8',
          secondary: '#9EAEBE',
          muted: '#637384',
        },
        accent: {
          DEFAULT: '#8FB8D6',
          2: '#D4A373',
        },
        success: '#68CFA4',
        warning: '#E5B888',
        danger: '#E06D77',
        gold: '#D4A373',
        category: {
          store_of_value: '#D4A373',
          smart_contract: '#8FB8D6',
          defi: '#B69EC9',
          stablecoin: '#68CFA4',
          other: '#9EAEBE',
        },
        persona: {
          cautious: {
            primary: '#68CFA4',
            secondary: '#2E6953',
          },
          balanced: {
            primary: '#8FB8D6',
            secondary: '#D4A373',
          },
          growth: {
            primary: '#D4A373',
            secondary: '#E06D77',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '22px',
        pill: '999px',
      },
      boxShadow: {
        z0: '0 1px 0 rgba(168, 196, 216, 0.04) inset',
        z1: '0 6px 16px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(168, 196, 216, 0.08) inset',
        z2: '0 14px 32px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(168, 196, 216, 0.12)',
        z3: '0 24px 50px rgba(0, 0, 0, 0.65), 0 0 24px rgba(143, 184, 214, 0.16)',
        z4: '0 34px 70px rgba(0, 0, 0, 0.75), 0 0 40px rgba(212, 163, 115, 0.22)',
        'btn-3d': '0 6px 0 #1b2633, 0 14px 24px rgba(0,0,0,0.5)',
        'btn-3d-hover': '0 8px 0 #1b2633, 0 20px 32px rgba(143, 184, 214, 0.3)',
        'btn-3d-active': '0 2px 0 #1b2633, 0 6px 12px rgba(0,0,0,0.4)',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '280ms',
        slow: '600ms',
        scene: '1200ms',
      },
    },
  },
  plugins: [],
};

export default config;
