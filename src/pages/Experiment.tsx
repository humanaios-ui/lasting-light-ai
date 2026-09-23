/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePseudonym } from '../hooks/usePseudonym';

export function Experiment() {
  const navigate = useNavigate();
  const pseudonym = usePseudonym();

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary via-bg-primary to-bg-secondary">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back to home */}
        <button
          onClick={() => navigate('/')}
          className="mb-12 text-accent-amber hover:text-accent-amber-bright transition"
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div className="mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-6 text-pale-orange">
            Constitutional Experiment
          </h1>
          <p className="text-ghost text-xl leading-relaxed max-w-2xl">
            Help us test how different collaboration models affect reasoning quality,
            error detection, and comprehension. Three regimes. One problem. Your choice.
          </p>
        </div>

        {/* Research transparency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-void-transparent border border-accent-amber-dim rounded-lg p-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent-amber mb-3">
              Anonymous
            </h3>
            <p className="text-ghost-dim text-sm">
              Pseudonymous by default. No email, no login, no tracking.
              Your identity stays yours.
            </p>
          </div>

          <div className="bg-void-transparent border border-accent-amber-dim rounded-lg p-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent-amber mb-3">
              Transparent
            </h3>
            <p className="text-ghost-dim text-sm">
              We show you what we're measuring and why. All data published.
              Reproducible research.
            </p>
          </div>

          <div className="bg-void-transparent border border-accent-amber-dim rounded-lg p-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent-amber mb-3">
              Useful
            </h3>
            <p className="text-ghost-dim text-sm">
              The problem is real. Your answer matters.
              Results shape how AI systems collaborate.
            </p>
          </div>
        </div>

        {/* Your info */}
        {pseudonym && (
          <div className="bg-accent-amber-dim-bg border border-accent-amber rounded-lg p-4 mb-12">
            <p className="text-sm text-ghost">
              <strong>Your pseudonym:</strong>{' '}
              <code className="font-mono text-accent-amber">{pseudonym.slice(0, 12)}...</code>
              <br />
              <span className="text-ghost-dim text-xs">
                Identity opt-in is not currently available in this prototype.
              </span>
            </p>
          </div>
        )}

        {/* Three regimes */}
        <div className="space-y-6 mb-16">
          <h2 className="font-serif text-2xl font-light text-pale-orange mb-8">
            Choose Your Regime
          </h2>

          {/* Regime A */}
          <button
            onClick={() => navigate('/regime-a')}
            className="w-full text-left p-8 bg-void-transparent border-2 border-accent-amber-dim hover:border-accent-amber rounded-lg transition group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif text-2xl text-pale-orange group-hover:text-accent-amber transition mb-2">
                  Regime A: Agreement Optimization
                </h3>
                <p className="text-ghost-dim text-sm max-w-2xl">
                  Baseline: See others' responses and propose a synthesis that resolves disagreement.
                  You're rewarded for making things coherent.
                </p>
              </div>
              <div className="text-accent-amber text-2xl">→</div>
            </div>

            <div className="flex gap-6 text-xs">
              <div>
                <span className="text-ghost-dim">Time:</span>
                <span className="text-ghost ml-2">~10 min</span>
              </div>
              <div>
                <span className="text-ghost-dim">Visibility:</span>
                <span className="text-ghost ml-2">See prior responses</span>
              </div>
              <div>
                <span className="text-ghost-dim">Incentive:</span>
                <span className="text-ghost ml-2">Convergence</span>
              </div>
            </div>
          </button>

          {/* Regime B */}
          <div
            className="w-full text-left p-8 bg-void-transparent border-2 border-accent-amber-dim rounded-lg group opacity-60 cursor-not-allowed"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif text-2xl text-pale-orange group-hover:text-accent-amber transition mb-2">
                  Regime B: Independent Contribution
                </h3>
                <p className="text-ghost-dim text-sm max-w-2xl">
                  Control: Answer alone, isolated from others. No collaboration signal.
                  Pure independent thinking.
                </p>
              </div>
              <div className="text-accent-amber-dim text-2xl">→</div>
            </div>

            <div className="flex gap-6 text-xs">
              <div>
                <span className="text-ghost-dim">Time:</span>
                <span className="text-ghost ml-2">~10 min</span>
              </div>
              <div>
                <span className="text-ghost-dim">Visibility:</span>
                <span className="text-ghost ml-2">Problem only</span>
              </div>
              <div>
                <span className="text-ghost-dim">Incentive:</span>
                <span className="text-ghost ml-2">Independence</span>
              </div>
            </div>

            <div className="mt-4 px-3 py-2 bg-accent-amber-dim rounded text-xs text-ghost-dim font-mono">
              Coming soon
            </div>
          </div>

          {/* Regime C */}
          <div
            className="w-full text-left p-8 bg-void-transparent border-2 border-accent-amber-dim rounded-lg group opacity-60 cursor-not-allowed"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif text-2xl text-pale-orange group-hover:text-accent-amber transition mb-2">
                  Regime C: Coherence Without Forced Convergence
                </h3>
                <p className="text-ghost-dim text-sm max-w-2xl">
                  Proposed: Share your reasoning (intent, assumptions, evidence, disagreement)
                  while preserving all perspectives. No pressure to agree.
                </p>
              </div>
              <div className="text-accent-amber-dim text-2xl">→</div>
            </div>

            <div className="flex gap-6 text-xs">
              <div>
                <span className="text-ghost-dim">Time:</span>
                <span className="text-ghost ml-2">~15 min</span>
              </div>
              <div>
                <span className="text-ghost-dim">Visibility:</span>
                <span className="text-ghost ml-2">Full contribution envelope</span>
              </div>
              <div>
                <span className="text-ghost-dim">Incentive:</span>
                <span className="text-ghost ml-2">Preserved dissent</span>
              </div>
            </div>

            <div className="mt-4 px-3 py-2 bg-accent-amber-dim rounded text-xs text-ghost-dim font-mono">
              Coming soon
            </div>
          </div>
        </div>

        {/* Research context */}
        <div className="bg-void-transparent border border-accent-amber-dim rounded-lg p-8 max-w-3xl">
          <h3 className="font-mono text-xs uppercase tracking-widest text-accent-amber mb-4">
            What We're Testing
          </h3>
          <div className="space-y-4 text-ghost-dim text-sm leading-relaxed">
            <p>
              This experiment tests the Constitutional principle{' '}
              <strong>"Harmony Without Forced Convergence"</strong> — from Issue #460
              (ChatGPT-5.6-Sol research).
            </p>
            <p>
              <strong>Hypothesis:</strong> Systems that preserve disagreement while exposing
              reasoning produce better outcomes (higher task quality, more error detection,
              better human comprehension) than systems optimizing for agreement or pure independence.
            </p>
            <p>
              <strong>Your role:</strong> You participate in one regime, contributing genuine
              reasoning. We measure: task quality, novel insights, false claims caught,
              dissent retained, and human comprehension.
            </p>
            <p className="text-ghost-dim italic">
              All results published. All data open. No deception, no engagement optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
