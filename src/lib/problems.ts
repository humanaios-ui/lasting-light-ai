// Problem definitions for Regime A/B/C experiments

export interface ProblemFraming {
  id: string;
  title: string;
  technical: string;
  governance: string;
  plain_language: string;
  research_context: string;
  success_criteria: string[];
}

export const PROBLEMS: Record<string, ProblemFraming> = {
  'problem-01-coherence': {
    id: 'problem-01-coherence',
    title: 'Coherence Without Forced Convergence',

    technical: `Design a coordination system where:
- Multiple independent AI agents (substrate-distinct, e.g., Claude + GPT-4 + Grok)
  collaborate on a problem without optimizing toward agreement
- Each agent exposes: intent, assumptions, uncertainty, evidence, inferences, disagreement
- Disagreement is preserved as first-class output (not collapsed into consensus)
- The system can answer: "On this point, we have material disagreement. Here's why."

The core constraint: No agent should be incentivized to change its conclusion
to match others. What does this system look like, and what tradeoffs does it require?`,

    governance: `Your organization coordinates across teams with different perspectives:
- Engineering teams report one thing; safety teams report another
- Human domain experts disagree with AI recommendations
- Regional practices conflict with global policy

Design a governance framework where disagreement is treated as valuable evidence,
not a failure to be resolved. The goal is not consensus—it's preserved coherence:
everyone understands why others disagree and what evidence supports their position.

What would have to be true about authority, reporting, and decision-making for this to work?`,

    plain_language: `Imagine three smart people looking at the same problem:
- One sees it through an engineering lens
- One sees it through a social impact lens
- One sees it through a financial lens

They disagree on the right answer. Usually, someone wins out and the others go along,
or they compromise and lose what made each perspective valuable.

Design a system where all three perspectives stay visible in the final decision.
The goal isn't to make them agree—it's to make their disagreement useful.

How would that work in practice?`,

    research_context: `This problem comes from the HumanAIOS Constitutional principle "Harmony Without
Forced Convergence" (Issue #460). Current collaboration systems optimize for agreement
(Regime A), which hides disagreement. Some teams try total independence (Regime B),
which loses collaboration benefits. This research tests whether preserved disagreement
(Regime C) produces better outcomes across task quality, error detection, and human comprehension.`,

    success_criteria: [
      'Identifies a core mechanism for preserving disagreement in coordination',
      'Names at least one tradeoff (e.g., slower decisions, higher cognitive load)',
      'Addresses how authority or decision-making changes in this system',
      'Shows understanding of when this approach would fail or be inappropriate',
      'Proposes a testable prediction: "If this system works, we should see..."',
    ],
  },
};

export function getProblem(problemId: string): ProblemFraming | null {
  return PROBLEMS[problemId] || null;
}

export function getProblemFraming(problemId: string, framing: 'technical' | 'governance' | 'plain_language'): string {
  const problem = getProblem(problemId);
  if (!problem) return '';
  return problem[framing];
}
