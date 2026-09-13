/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AcatTool } from './AcatTool';

// These tests pin the state-initialisation behaviour that used to live in two
// effects: seeding runs from localStorage when the agent name changes, and
// resetting the score inputs when the selected run changes. They were written
// against that effect-based implementation and passed before it was rewritten,
// so they check that the rewrite preserved behaviour rather than describing it
// after the fact.

const DIM_COUNT = 11;

function run(id: string, p1: number[] | null, p3: number[] | null = null) {
  return {
    id,
    p1Scores: p1 ?? Array(DIM_COUNT).fill(0),
    perturbationType: null,
    p2Shown: false,
    p3Scores: p3,
    p3DimOrder: null,
    timestamp: '2026-01-01T00:00:00.000Z',
  };
}

function seed(agent: string, runs: unknown[]) {
  localStorage.setItem(`acat55_${agent}`, JSON.stringify(runs));
}

function p1Value(dim: string) {
  return (document.getElementById(`p1-${dim}`) as HTMLInputElement | null)?.value;
}

function runButtons() {
  return screen.getAllByRole('button', { name: /^Run \d/ });
}

beforeEach(() => {
  localStorage.clear();
  // The component fetches live stats on mount. A promise that never settles
  // keeps that request out of these tests without faking a response shape.
  vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
  // Starting a run schedules a smooth scroll that jsdom does not implement.
  vi.stubGlobal('scrollTo', vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('AcatTool run state', () => {
  it('creates one empty run when the agent has nothing stored', () => {
    render(<AcatTool />);

    expect(runButtons()).toHaveLength(1);
    expect(p1Value('truth')).toBe('0');
  });

  it('restores stored runs and selects the most recent one', () => {
    seed('Demo Agent', [
      run('a', [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11]),
      run('b', [22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22]),
    ]);

    render(<AcatTool />);

    expect(runButtons()).toHaveLength(2);
    expect(p1Value('truth')).toBe('22');
  });

  it('resyncs the score inputs when a different run is selected', () => {
    seed('Demo Agent', [
      run('a', [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11]),
      run('b', [22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22]),
    ]);

    render(<AcatTool />);
    expect(p1Value('truth')).toBe('22');

    fireEvent.click(runButtons()[0]);

    expect(p1Value('truth')).toBe('11');
  });

  it('reloads runs from the new bucket when the agent name changes', () => {
    seed('Demo Agent', [run('a', [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11])]);
    seed('Other Agent', [
      run('x', [33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33]),
      run('y', [44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44]),
    ]);

    render(<AcatTool />);
    expect(p1Value('truth')).toBe('11');

    fireEvent.change(document.getElementById('agent-name-input')!, {
      target: { value: 'Other Agent' },
    });

    expect(runButtons()).toHaveLength(2);
    expect(p1Value('truth')).toBe('44');
  });

  it('starts a fresh run when the stored value is not valid JSON', () => {
    localStorage.setItem('acat55_Demo Agent', '{not json');

    render(<AcatTool />);

    expect(runButtons()).toHaveLength(1);
    expect(p1Value('truth')).toBe('0');
  });

  it('adds a run without discarding the existing ones', () => {
    seed('Demo Agent', [run('a', [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11])]);

    render(<AcatTool />);
    fireEvent.click(screen.getByRole('button', { name: /New run/i }));

    expect(runButtons()).toHaveLength(2);
    // The new run is selected and empty.
    expect(p1Value('truth')).toBe('0');
  });

});

describe('AcatTool live stats', () => {
  function stubStats(body: unknown) {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ json: () => Promise.resolve(body) })));
  }

  it('reports the fetched mean Learning Index to its parent', async () => {
    const onMeanLIUpdate = vi.fn();
    stubStats([{ n_total: 700, n_phase1: 600, n_li: 400, mean_li: 0.9123, dimensions: {} }]);

    render(<AcatTool onMeanLIUpdate={onMeanLIUpdate} />);

    await waitFor(() => expect(onMeanLIUpdate).toHaveBeenCalledWith(0.9123));
  });

  // Both branches below wait on the Live Dataset banner, which renders only once
  // liveStats is set — that is, only after the fetch continuation has run. An
  // earlier version waited on the agent-name field, which is present from the
  // first render, so the assertions ran before the promise settled and would
  // have passed even if the branch under test did nothing at all.
  it('does not report a mean when the query comes back empty', async () => {
    const onMeanLIUpdate = vi.fn();
    stubStats([]);

    render(<AcatTool onMeanLIUpdate={onMeanLIUpdate} />);

    // The empty branch falls back to archived figures for display but must not
    // pass them upward as a live reading.
    await screen.findByText('Live Dataset');
    expect(screen.getByText('0.8632')).toBeInTheDocument();
    expect(onMeanLIUpdate).not.toHaveBeenCalled();
  });

  it('survives a failed request without reporting a mean', async () => {
    const onMeanLIUpdate = vi.fn();
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))));

    render(<AcatTool onMeanLIUpdate={onMeanLIUpdate} />);

    await screen.findByText('Live Dataset');
    expect(screen.getByText('0.8632')).toBeInTheDocument();
    expect(onMeanLIUpdate).not.toHaveBeenCalled();
  });
});
