import { createPreset } from 'fumadocs-ui/tailwind-plugin'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
    './mdx-components.{ts,tsx}',
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
  presets: [
    createPreset({
      cssPrefix: 'fd',
    }),
  ],
  theme: {
    extend: {
      colors: {
        'primary-background': 'var(--primary-background)',
        warn: 'hsl(var(--warn) / <alpha-value>)',
        danger: 'hsl(var(--danger) / <alpha-value>)',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--fd-foreground) / 0.9)',
            '--tw-prose-headings': 'hsl(var(--fd-foreground) / 1)',
            '--tw-prose-lead': 'hsl(var(--fd-foreground) / 1)',
            '--tw-prose-links': 'hsl(var(--fd-primary) / 1)',
            '--tw-prose-bold': 'hsl(var(--fd-foreground) / 1)',
            '--tw-prose-counters': 'hsl(var(--fd-muted-foreground) / 1)',
            '--tw-prose-bullets': 'hsl(var(--fd-muted-foreground) / 1)',
            '--tw-prose-hr': 'hsl(var(--fd-border) / 1)',
            '--tw-prose-quotes': 'hsl(var(--fd-foreground) / 1)',
            '--tw-prose-quote-borders': 'hsl(var(--fd-border) / 1)',
            '--tw-prose-captions': 'hsl(var(--fd-foreground) / 1)',
            '--tw-prose-code': 'hsl(var(--fd-foreground) / 1)',
            '--tw-prose-th-borders': 'hsl(var(--fd-border) / 1)',
            '--tw-prose-td-borders': 'hsl(var(--fd-border) / 1)',
            '--tw-prose-kbd': 'hsl(var(--fd-foreground) / 1)',
            '--tw-prose-kbd-shadows': 'hsl(var(--fd-primary) / 0.5)',
          },
        },
      },
    },
  },
}

export default config
