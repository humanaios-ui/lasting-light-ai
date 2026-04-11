
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        'accent-amber': 'var(--accent-amber)',
        'accent-amber-bright': 'var(--accent-amber-bright)',
        'accent-amber-dim': 'var(--accent-amber-dim)',
        'accent-ember': 'var(--accent-ember)',
        'accent-sage': 'var(--accent-sage)',
        'accent-blue': 'var(--accent-blue)',
        'pale-orange': 'var(--pale-orange)',
        'bg-primary': 'var(--bg-primary)',
        'muted-orange-2': 'var(--muted-orange-2)',
        'void': 'var(--void)',
        'deep': 'var(--deep)',
        'surface': 'var(--surface)',
        'rim': 'var(--rim)',
        'mist': 'var(--mist)',
        'tide-deep': 'var(--tide-deep)',
        'tide-mid': 'var(--tide-mid)',
        'tide-crest': 'var(--tide-crest)',
        'silver': 'var(--silver)',
        'ghost': 'var(--ghost)',
        'whisper': 'var(--whisper)',
        'confirm': 'var(--confirm)',
        'warn': 'var(--warn)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
    }
  }
}
