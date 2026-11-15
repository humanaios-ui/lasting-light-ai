/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Status: EXPERIMENTAL Z1
   HumanAIOS Living Lab E0. Fictional data; preview only, with no data collection. */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  pilotArms, syntheticCase, questions, scorePilot, isComplete,
  type PilotArm, type Answers,
} from '../lib/witnessChallengePilot';

const panel = 'rounded-xl border border-accent-amber-dim bg-void-transparent p-5 md:p-7';
const button = 'min-h-11 rounded-lg border border-accent-amber-dim px-4 py-3 text-left text-pale-orange hover:border-accent-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-amber';

export function LivingLab() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary">
      <div className="mx-auto max-w-5xl px-5 py-14">
        <Link to="/" className="text-accent-amber underline underline-offset-4">← HumanAIOS home</Link>
        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-accent-amber">Living Research Laboratory · Proposed</p>
        <h1 className="mt-4 font-serif text-4xl font-light text-pale-orange md:text-6xl">Study how humans and AI decide.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ghost">
          Our question is simple: can AI help people reach better-supported decisions with less effort,
          without losing evidence or control? We will publish methods, limitations, and results only
          after suitable review and consent.
        </p>
        <section className={panel + ' mt-10'} aria-labelledby="pilot-heading">
          <p className="font-mono text-xs uppercase tracking-widest text-accent-amber">Pilot 01 · Private QA preview</p>
          <h2 id="pilot-heading" className="my-3 font-serif text-3xl text-pale-orange">The Witness Challenge</h2>
          <p className="text-ghost">
            Compare raw evidence, a scripted AI summary, and a scripted Witness critique
            on a fictional resource decision. Answer five questions. Review a local score.
          </p>
          <p className="mt-3 text-sm text-accent-amber">
            Not recruiting · Not a registered public study · No real AI calls · No participant answers saved.
          </p>
          <Link to="/lab/witness-challenge" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-accent-amber px-5 py-3 font-semibold text-void hover:bg-accent-amber-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Open the fictional pilot preview
          </Link>
        </section>
        <section className="mt-10" aria-labelledby="future-lab">
          <h2 id="future-lab" className="font-serif text-2xl text-pale-orange">Future studies · Not active</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Missing Proof Maze', 'Dissent Garden', 'Teach-Back Relay',
              'Human Authority Gate', 'Human Bridge', 'Calibration Mirror',
            ].map(name => (
              <div key={name} className={panel}>
                <strong className="font-serif text-xl text-pale-orange">{name}</strong>
                <p className="mt-2 text-sm text-ghost">Research design pending. No public participation yet.</p>
              </div>
            ))}
          </div>
        </section>
        <p className="mt-10 max-w-3xl text-sm text-ghost">
          See the public <a className="underline text-accent-amber" href="https://github.com/humanaios-ui/operations/issues/1230" target="_blank" rel="noopener noreferrer">research program and safeguards</a>.
          The existing ACAT and Constitutional Experiment remain separate and unchanged.
        </p>
      </div>
    </div>
  );
}

export function WitnessChallenge() {
  const [arm, setArm] = useState<PilotArm>('RAW');
  const [stage, setStage] = useState<'setup' | 'task' | 'review'>('setup');
  const [answers, setAnswers] = useState<Answers>({});
  const [confidence, setConfidence] = useState<number>(3);
  const [burden, setBurden] = useState<number>(3);
  const [startMs, setStartMs] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [opens, setOpens] = useState(0);
  const [showSources, setShowSources] = useState(true);
  const result = stage === 'review' ? scorePilot(answers) : null;

  function begin() {
    setAnswers({});
    setElapsed(null);
    setConfidence(3);
    setBurden(3);
    setOpens(0);
    setShowSources(true);
    setStartMs(performance.now());
    setStage('task');
  }
  function finish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete(answers)) return;
    setElapsed(startMs === null ? null : Math.round((performance.now() - startMs) / 1000));
    setStage('review');
  }
  function reset() {
    setStage('setup');
    setAnswers({});
    setStartMs(null);
    setElapsed(null);
    setOpens(0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary via-bg-primary to-bg-secondary">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <Link to="/lab" className="text-accent-amber underline underline-offset-4">← Laboratory</Link>
        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-accent-amber">Witness Challenge · E0 · Fictional simulation</p>
        <h1 className="mt-4 font-serif text-4xl font-light text-pale-orange md:text-5xl">Can you spot the missing proof?</h1>
        <p className="mt-4 max-w-3xl text-ghost">
          Practice examining a resource claim. The sources and AI text are written for this demonstration.
          No real application, deadline, provider, or model is involved.
        </p>
        <div className="mt-6 rounded-lg border border-accent-amber-dim bg-accent-amber-dim-bg p-4 text-sm text-pale-orange" role="note">
          <strong>Technical preview only.</strong> This is not live research, a participant recruitment page,
          or a real eligibility decision. Responses, time, and scores are held only in React memory.
          This feature sends no submissions, runs no live AI calls, and keeps no experiment records.
          Site-wide services outside this feature are not part of this assurance.
        </div>

        {stage === 'setup' && (
          <section className={panel + ' mt-8'} aria-labelledby="arm-heading">
            <h2 id="arm-heading" className="font-serif text-3xl text-pale-orange">Choose a QA condition</h2>
            <p className="mt-2 text-ghost">
              For developer review only. You choose the condition here; a future approved human
              study would use a preregistered random assignment instead.
            </p>
            <fieldset className="mt-6 space-y-3">
              <legend className="mb-3 font-semibold">Which evidence view would you like to test?</legend>
              {pilotArms.map(item => (
                <label key={item.id} className={button + ' flex cursor-pointer items-start gap-3'}>
                  <input className="mt-1 h-4 w-4 accent-amber-500" type="radio" name="preview-arm"
                    value={item.id} checked={arm === item.id} onChange={() => setArm(item.id)} />
                  <span><strong className="block text-pale-orange">{item.name}</strong>
                    <span className="text-sm text-ghost">{item.description}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <button className="mt-7 min-h-11 rounded-lg bg-accent-amber px-6 py-3 font-semibold text-void hover:bg-accent-amber-bright"
              type="button" onClick={begin}>Start fictional task</button>
          </section>
        )}

        {stage !== 'setup' && (
          <>
            <section className={panel + ' mt-8'} aria-labelledby="case-heading">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs uppercase tracking-widest text-accent-amber">Fixed case · {syntheticCase.id} · {syntheticCase.version}</p>
                <span className="text-xs text-ghost">Preview condition: {arm}</span>
              </div>
              <h2 id="case-heading" className="mt-2 font-serif text-3xl text-pale-orange">{syntheticCase.title}</h2>
              <p className="mt-2 text-ghost">{syntheticCase.decision}</p>
              <p className="mt-2 text-sm text-accent-amber">{syntheticCase.disclosure}</p>

              {stage === 'task' && (
                <div className="mt-5">
                  <button type="button" className={button} aria-expanded={showSources}
                    onClick={() => {setShowSources(v => !v); setOpens(n => n + 1);}}>
                    {showSources ? 'Hide fictional source documents' : 'Open fictional source documents'}
                  </button>
                </div>
              )}
              {(stage === 'review' || showSources) && (
                <div className="mt-5 grid gap-4 md:grid-cols-3" aria-label="Same source documents for every condition">
                  {syntheticCase.evidence.map(item => (
                    <article key={item.id} className="rounded-lg border border-accent-amber-dim p-4">
                      <p className="font-mono text-xs text-accent-amber">{item.id} · FICTIONAL</p>
                      <h3 className="mt-1 font-semibold text-pale-orange">{item.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ghost">{item.text}</p>
                    </article>
                  ))}
                </div>
              )}
              {(arm === 'SUMMARY' || arm === 'WITNESS') && (
                <div className="mt-5 rounded-lg border border-accent-blue p-4">
                  <h3 className="font-semibold text-pale-orange">Simulated AI summary</h3>
                  <p className="mt-2 text-sm text-ghost">{syntheticCase.scriptedSummary}</p>
                </div>
              )}
              {arm === 'WITNESS' && (
                <div className="mt-4 rounded-lg border border-accent-sage p-4">
                  <h3 className="font-semibold text-pale-orange">Simulated Witness challenge</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ghost">{syntheticCase.scriptedWitness}</p>
                </div>
              )}
            </section>

            {stage === 'task' && (
              <form className={panel + ' mt-8 space-y-7'} onSubmit={finish}>
                <h2 className="font-serif text-3xl text-pale-orange">Your decision</h2>
                {questions.map((q, index) => (
                  <fieldset key={q.key} className="border-b border-accent-amber-dim pb-5">
                    <legend className="mb-3 font-semibold text-pale-orange">{index + 1}. {q.prompt}</legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {q.options.map(option => (
                        <label key={option.value} className={button + ' flex cursor-pointer items-center gap-3'}>
                          <input type="radio" className="h-4 w-4" name={q.key} value={option.value}
                            checked={answers[q.key] === option.value}
                            onChange={() => setAnswers(p => ({...p, [q.key]: option.value}))} />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-pale-orange" htmlFor="pilot-confidence">
                    Confidence in your answers: {confidence} / 5
                    <input id="pilot-confidence" className="mt-2 block w-full" type="range" min="1" max="5"
                      value={confidence} onChange={e => setConfidence(Number(e.target.value))} />
                  </label>
                  <label className="block text-pale-orange" htmlFor="pilot-burden">
                    Felt mental effort: {burden} / 7
                    <input id="pilot-burden" className="mt-2 block w-full" type="range" min="1" max="7"
                      value={burden} onChange={e => setBurden(Number(e.target.value))} />
                  </label>
                </div>
                <button type="submit" disabled={!isComplete(answers)}
                  className="min-h-11 rounded-lg bg-accent-amber px-6 py-3 font-semibold text-void hover:bg-accent-amber-bright disabled:cursor-not-allowed disabled:opacity-50">
                  Score locally and show evidence
                </button>
                <p className="text-sm text-ghost">Five responses required. Nothing is sent to a server.</p>
              </form>
            )}

            {stage === 'review' && result && (
              <section className={panel + ' mt-8'} aria-labelledby="results-heading">
                <p className="font-mono text-xs uppercase tracking-widest text-accent-amber">Local-only practice feedback</p>
                <h2 id="results-heading" className="mt-2 font-serif text-3xl text-pale-orange">
                  {result.correct} of {result.total} answers supported
                </h2>
                <p className="mt-2 text-sm text-ghost">{result.status}. No result was submitted or stored.</p>
                {(result.criticalFalseReady || result.wrongAuthority) && (
                  <p className="mt-3 rounded-lg border border-red-400 p-3 text-sm text-pale-orange" role="alert">
                    {result.criticalFalseReady ? 'Your decision marked an unsupported application READY. ' : ''}
                    {result.wrongAuthority ? 'Your authorization answer did not preserve the human gate.' : ''}
                  </p>
                )}
                <div className="mt-5 space-y-3">
                  {result.details.map((item, i) => (
                    <div className="border-b border-accent-amber-dim pb-3" key={item.key}>
                      <p className="font-semibold">{item.correct ? 'Correct' : 'Review'} · {questions[i].prompt}</p>
                      <p className="mt-1 text-sm text-ghost">{item.explanation}</p>
                      <p className="mt-1 font-mono text-xs text-accent-amber">Source: {item.sourceIds.join(', ')}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm text-ghost">
                  Local practice only: {elapsed === null ? 'time unavailable' : elapsed + ' seconds'} elapsed;
                  {opens} source-toggle actions; confidence {confidence}/5; felt effort {burden}/7.
                  These numbers are **not** participant research outcomes.
                </p>
                <button type="button" onClick={reset} className={button + ' mt-6'}>Clear answers and return to setup</button>
              </section>
            )}
          </>
        )}
        <p className="mt-10 text-xs text-ghost">No public recruitment, data collection, eligibility decision or permission to act. The answer key is fictional and defined in source. Research proposal: <a href="https://github.com/humanaios-ui/operations/issues/1230" target="_blank" rel="noopener noreferrer" className="underline text-accent-amber">operations #1230</a>.</p>
      </div>
    </div>
  );
}
