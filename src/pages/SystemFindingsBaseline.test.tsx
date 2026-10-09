/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SystemFindingsBaseline } from './SystemFindingsBaseline';

describe('SystemFindingsBaseline', () => {
  it('presents a qualified system stance and pre-action checks', () => {
    render(<SystemFindingsBaseline />);

    expect(screen.getByRole('heading', { name: 'Overall System Stance' })).toBeInTheDocument();
    expect(screen.getByText(/static examples—not live measurements/i)).toBeInTheDocument();
    expect(screen.getByText(/Potential opportunities/i)).toBeInTheDocument();
    expect(screen.getByText(/Evidence that supports/i)).toBeInTheDocument();
    expect(screen.getByText(/Evidence that limits/i)).toBeInTheDocument();
    expect(screen.getByText(/not yet established/i)).toBeInTheDocument();
    expect(screen.getByText(/Before consequential action/i)).toBeInTheDocument();
    expect(screen.getByText(/No consequential action is authorized by this overview/i)).toBeInTheDocument();
  });
});
