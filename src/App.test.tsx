/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { App } from './App';

describe('App shell', () => {
  it('renders core navigation and home content', () => {
    render(<App />);
    expect(screen.getByText('HumanAIOS')).toBeInTheDocument();
    expect(screen.getByText('Why This Is Not Optional')).toBeInTheDocument();
  });

  it('highlights the experiment nav item only for experiment routes', () => {
    window.history.pushState({}, '', '/assess');
    const { unmount } = render(<App />);
    expect(screen.getByRole('link', { name: 'Constitutional Experiment' })).toHaveStyle({
      background: 'transparent',
    });

    unmount();

    window.history.pushState({}, '', '/regime-a');
    render(<App />);
    expect(screen.getByRole('link', { name: 'Constitutional Experiment' })).toHaveStyle({
      background: 'rgba(212,160,74,0.1)',
    });
  });
});
