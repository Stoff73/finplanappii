/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Style guide colors
        'primary-blue': '#1E3A8A',
        'primary-white': '#FFFFFF',
        'primary-dark': '#1F2937',
        'secondary-blue-light': '#3B82F6',
        'secondary-blue-pale': '#EFF6FF',
        'secondary-gray': '#6B7280',
        'accent-green': '#10B981',
        'accent-green-light': '#34D399',
        'accent-blue-bright': '#06B6D4',
      },
      fontFamily: {
        'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '40px' }],
        'h2': ['28px', { lineHeight: '36px' }],
        'h3': ['24px', { lineHeight: '32px' }],
        'h4': ['20px', { lineHeight: '28px' }],
        'body-large': ['18px', { lineHeight: '28px' }],
        'body': ['16px', { lineHeight: '24px' }],
        'body-small': ['14px', { lineHeight: '20px' }],
        'caption': ['12px', { lineHeight: '16px' }],
        'financial': ['20px', { lineHeight: '28px' }],
      },
      spacing: {
        '52': '52px', // Button height
        '56': '56px', // Input height
        '64': '64px', // Financial input height
        '72': '72px', // Navigation height
      },
      borderRadius: {
        'button': '12px',
        'card': '16px',
        'card-large': '20px',
        'input': '12px',
        'search': '24px',
        'risk-badge': '6px',
      },
      boxShadow: {
        'card': '0 1px 12px rgba(0, 0, 0, 0.06)',
        'card-financial': '0 2px 16px rgba(0, 0, 0, 0.08)',
        'card-goal': '0 1px 8px rgba(0, 0, 0, 0.04)',
        'button': '0 2px 8px rgba(0, 0, 0, 0.12)',
        'nav': '0 -2px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
