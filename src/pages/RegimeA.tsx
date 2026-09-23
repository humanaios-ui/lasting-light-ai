/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePseudonym } from '../hooks/usePseudonym';
import {
  getProblem,
  getProblemFraming,
  type ProblemFraming,
} from '../lib/problems';
import {
  submitResponse,
  getRegimeAResponses,
  type Submission,
} from '../lib/storage';

interface RegimeAProps {
  problemId?: string;
}

export function RegimeA({ problemId = 'problem-01-coherence' }: RegimeAProps) {
  const navigate = useNavigate();
  const pseudonym = usePseudonym();
  const [problem, setProblem] = useState<ProblemFraming | null>(null);
  const [framing, setFraming] = useState<'technical' | 'governance' | 'plain_language'>('plain_language');
  const [priorResponses, setPriorResponses] = useState<Submission[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [synthesis, setSynthesis] = useState('');
  const [confidence, setConfidence] = useState(5);
  const [evidenceRefs, setEvidenceRefs] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [agreeToPublish, setAgreeToPublish] = useState(true);

  useEffect(() => {
    const loaded = getProblem(problemId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProblem(loaded);
    if (loaded) {
      // Load prior responses for this problem
      const responses = getRegimeAResponses(problemId);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPriorResponses(responses);
    }
  }, [problemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!synthesis.trim() || !pseudonym) return;

    setLoading(true);
    try {
      // Submit response
      const refs = evidenceRefs
        .split('\n')
        .map(r => r.trim())
        .filter(r => r.length > 0);

      submitResponse('A', problemId, {
        synthesis: synthesis.trim(),
        confidence: parseInt(String(confidence)),
        evidence_refs: refs,
        recommendation: recommendation.trim(),
        boundaries: {
          can_contact: false,
          can_cite: agreeToPublish,
          opted_into_identity: false,
        },
      });

      // Reload prior responses to show new submission
      const updated = getRegimeAResponses(problemId);
      setPriorResponses(updated);

      setSubmitted(true);
      setSynthesis('');
      setConfidence(5);
      setEvidenceRefs('');
      setRecommendation('');
    } finally {
      setLoading(false);
    }
  };

  if (!problem || !pseudonym) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center text-pale-orange">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary via-bg-primary to-bg-secondary">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <button
          onClick={() => navigate('/experiment')}
          className="mb-8 text-accent-amber hover:text-accent-amber-bright transition"
        >
          ← Back to Experiment
        </button>

        <h1 className="font-serif text-4xl md:text-5xl font-light mb-4 text-pale-orange">
          Regime A: Agreement Optimization
        </h1>

        <div className="max-w-2xl mb-8">
          <p className="text-ghost text-lg leading-relaxed mb-6">
            In this regime, you'll read prior responses and propose a <em>synthesis</em>
            that makes sense of disagreement. The goal is to find common ground and
            show how different perspectives might be unified.
          </p>

          <div className="bg-void-transparent border border-accent-amber-dim rounded-lg p-4">
            <p className="text-sm text-ghost-dim">
              <strong>How this works:</strong> You're anonymous (pseudonym: {pseudonym.slice(0, 8)}...).
              Your responses help us understand how collaboration works when agreement is rewarded.
              All data is stored locally and shown in the results dashboard.
            </p>
          </div>
        </div>

        {/* Framing selector */}
        <div className="flex gap-2 mb-8">
          {(['technical', 'governance', 'plain_language'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFraming(f)}
              className={`px-4 py-2 rounded transition font-mono text-sm ${
                framing === f
                  ? 'bg-accent-amber text-bg-primary'
                  : 'border border-accent-amber-dim text-accent-amber hover:bg-accent-amber-dim-bg'
              }`}
            >
              {f === 'plain_language' ? 'Plain' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Problem statement */}
          <div className="lg:col-span-2">
            <div className="bg-void-transparent border border-accent-amber-dim rounded-lg p-8 sticky top-24">
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent-amber mb-4">
                The Problem
              </h2>
              <div className="prose prose-invert max-w-none">
                <div className="text-ghost leading-relaxed whitespace-pre-wrap">
                  {getProblemFraming(problemId, framing)}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-accent-amber-dim">
                <h3 className="font-mono text-xs uppercase tracking-widest text-accent-amber-dim mb-4">
                  Success Criteria
                </h3>
                <ul className="space-y-2 text-sm text-ghost-dim">
                  {problem.success_criteria.map((criterion, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-accent-amber">→</span>
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar: Prior responses + form */}
          <div className="lg:col-span-1">
            {/* Prior responses */}
            <div className="mb-8">
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent-amber mb-4">
                Prior Responses ({priorResponses.length})
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {priorResponses.length === 0 ? (
                  <p className="text-sm text-ghost-dim italic">
                    No responses yet. Be the first to synthesize.
                  </p>
                ) : (
                  priorResponses.map((response, i) => (
                    <div
                      key={response.id}
                      className="bg-void-transparent border border-accent-amber-dim-bg rounded p-4 text-sm"
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-ghost-dim">Response {i + 1}</span>
                        <span className="text-accent-amber text-xs bg-accent-amber-dim-bg px-2 py-1 rounded">
                          {response.confidence}/10
                        </span>
                      </div>
                      <p className="text-ghost-dim text-xs line-clamp-3">
                        {response.synthesis}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Submission form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="synthesis" className="block font-mono text-xs uppercase tracking-widest text-accent-amber mb-2">
                    Your Synthesis
                  </label>
                  <textarea
                    id="synthesis"
                    value={synthesis}
                    onChange={e => setSynthesis(e.target.value)}
                    placeholder="What's your synthesis that makes sense of prior responses? How might disagreement be unified?"
                    rows={4}
                    required
                    className="w-full px-3 py-2 bg-void-transparent border border-accent-amber-dim rounded text-ghost placeholder:text-ghost-dim text-sm leading-relaxed focus:outline-none focus:border-accent-amber transition"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-accent-amber mb-2">
                    Confidence: {confidence}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={confidence}
                    onChange={e => setConfidence(parseInt(e.target.value))}
                    className="w-full accent-accent-amber"
                  />
                </div>

                <div>
                  <label htmlFor="evidence" className="block font-mono text-xs uppercase tracking-widest text-accent-amber mb-2">
                    Evidence / Citations (one per line)
                  </label>
                  <textarea
                    id="evidence"
                    value={evidenceRefs}
                    onChange={e => setEvidenceRefs(e.target.value)}
                    placeholder="Link, paper, quote, or observation"
                    rows={2}
                    className="w-full px-3 py-2 bg-void-transparent border border-accent-amber-dim rounded text-ghost placeholder:text-ghost-dim text-sm focus:outline-none focus:border-accent-amber transition"
                  />
                </div>

                <div>
                  <label htmlFor="recommendation" className="block font-mono text-xs uppercase tracking-widest text-accent-amber mb-2">
                    Recommendation (optional)
                  </label>
                  <textarea
                    id="recommendation"
                    value={recommendation}
                    onChange={e => setRecommendation(e.target.value)}
                    placeholder="What should we do next based on this synthesis?"
                    rows={2}
                    className="w-full px-3 py-2 bg-void-transparent border border-accent-amber-dim rounded text-ghost placeholder:text-ghost-dim text-sm focus:outline-none focus:border-accent-amber transition"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="publish"
                    checked={agreeToPublish}
                    onChange={e => setAgreeToPublish(e.target.checked)}
                    className="mt-1 accent-accent-amber"
                  />
                  <label htmlFor="publish" className="text-xs text-ghost-dim leading-relaxed">
                    I agree my response can be cited in research results.
                    (You stay anonymous regardless.)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !synthesis.trim()}
                  className="w-full bg-gradient-to-r from-accent-amber to-accent-amber-bright text-bg-primary font-semibold py-3 rounded transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Synthesis'}
                </button>
              </form>
            ) : (
              <div className="bg-void-transparent border border-accent-amber rounded p-4">
                <p className="text-accent-amber font-semibold mb-2">✓ Response submitted</p>
                <p className="text-sm text-ghost-dim mb-4">
                  Your synthesis is now visible to future participants.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSynthesis('');
                  }}
                  className="text-accent-amber hover:text-accent-amber-bright text-sm font-mono uppercase tracking-wider"
                >
                  Submit another →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
