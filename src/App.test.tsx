/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { App } from './App';

describe('App shell', () => {
  it('renders core navigation and home content', () => {
    render(<App />);
    expect(screen.getByText('HumanAIOS')).toBeInTheDocument();
    expect(screen.getByText('Why This Is Not Optional')).toBeInTheDocument();
  });

  it('opens the system stance page from navigation', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'System Stance' }));

    expect(await screen.findByRole('heading', { name: 'Overall System Stance' })).toBeInTheDocument();
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
