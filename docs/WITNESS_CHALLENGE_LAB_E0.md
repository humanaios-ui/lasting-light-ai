# HumanAIOS Living Research Laboratory — Witness Challenge E0

**Canonical proposal:** [Operations issue #1230](https://github.com/humanaios-ui/operations/issues/1230).  
**Status:** `Z1 / PROPOSED_CODE / FICTIONAL_QA_ONLY / NO PARTICIPANTS / NO RECRUITMENT / NO DEPLOYMENT`.  
**Repository:** `humanaios-ui/lasting-light-ai`.  
**Human admission:** not granted. Work remains an isolated draft proposal.

## Exact scope

- React route `/lab`: laboratory directory, status, links to methods/plan. Existing homepage and current `/experiment`, `/assess`, ACAT and private INTENT-OS untouched.
- React route `/lab/witness-challenge`: one entirely fictional resource decision and one same-for-every-condition evidence packet, with 3 selectable **QA preview** conditions:
  - A: source documents only;
  - B: same sources + **fixed simulated AI recommendation**, including unsupported optimism;
  - C: same sources + identical summary + **fixed simulated Witness challenge**.
- Five source-bound questions: HOLD vs READY vs REJECT; missing registration proof; unknown first-party deadline; who holds submission authority; whether any verified public benefit occurred.
- Local scoring and after-answer debrief. False READY and incorrect authority are flagged even if a total looks satisfactory. No real model output, no grants, no provider, no action endpoints.
- Active duration from `performance.now()`, confidence, mental effort, and source-toggle taps appear in the current tab **only**. Clearing/reloading resets them. No `fetch`, `POST`, cookies, localStorage, sessionStorage, analytics or participant API is introduced by this feature. The surrounding established website may independently load other services; the statement applies to the pilot feature.
- Group selection by human is **not randomization**, so manual QA screens cannot establish causal experimental benefit. No collected participant data and no results published. All links to #1230 are public method/source references only.

## QA steps (code / browser)

```sh
npm ci
npm run lint
npm run typecheck
npm run test:run
npm run build
npx playwright install chromium
npx playwright test e2e/witness-challenge-lab.spec.ts
npm run dev -- --host 127.0.0.1 --port 4173
# Preview at http://127.0.0.1:4173/lab
```

The existing `frontend-quality-gates.yml` executes these as part of normal PR checks. Test cases assert a unique source reference set, a frozen answer key, true HOLD, no verified benefit, no false READY, and accessible navigation. Browser tests cover every QA arm, 390px viewport, no pilot submission and local score reset. Tests validate implementation, not human benefit.

## Research protocol to create **before real participants**

1. Independent ethics review / jurisdiction-appropriate human-subjects determination; clear actual inclusion age, purpose, consent and research contacts.
2. Verify exact ACAT/collaboration instrument versions; isolate this task from old `src/pages/Experiment.tsx` browser storage/publication defaults. Never silently inherit an "all results public" policy.
3. Freeze multiple independently reviewed **synthetic** cases with enough variation and matched difficulty to prevent learning/ceiling effects. Create a source-grounded answer key before group assignment, and separate writer from scorer.
4. Preregister randomized between-subject A/B/C conditions, inclusion/exclusion, primary endpoint (supported-decision accuracy), false READY safety flag, effort/time, evidence retention, confidence, burden, model prompt/version, research endpoints, time cap and analysis plan.
5. For any approved study, assign participants server-side under short-lived pseudonymous research IDs, log group assignment and exact stimuli version **only with consent** into a privacy-reviewed, access-controlled research store. Never put raw identifiable answers/prompts in public GitHub. Make withdrawal/retention/deletion rules real.
6. Obtain human/Z2 approval for public deployment, participant recruitment, paid rewards, external provider connections and release of de-identified aggregates. These are distinct gates, not automatically granted by an issue or a green CI run.
7. Run feasibility testing, then independent analysis; report missingness, exclusions, uncertainty, null results and effect sizes. A `n=50` feasibility pilot would not support strong general causal conclusions.

## Known limits / explicit falsifiers

- The AI and Witness texts are hand-authored **simulations**. C may make the expected answer unusually easy; this cannot be interpreted as a real Witness model's efficacy. Freeze an AI/Witness response protocol in a later study.
- A single fixed case is suitable only for UI and scoring QA, not human research.
- Manual condition choice is confounded and not randomized.
- Client-only self-scoring with visible debrief is not tamper-resistant and cannot prevent repeat attempts.
- No comparison of real human time or decision quality has occurred; zero research participants and zero outcomes.
- Observing the correct answer in C is an intended demonstration. It is not independent validation or certification.
- Existing site `/experiment` promises broad publication and uses browser storage; a privacy correction needs a **separate scoped change** and independent consent review before expanding recruitment.
- Treat unverified source links, unavailable storage, inaccessible controls, leak of private data, unapproved provider call, incorrect authority, or false-live signal as a HOLD.

## Rollback

Discard/revert this PR. Scope is additive: `src/lib/witnessChallengePilot.ts` and tests, `src/pages/LivingLab.tsx`, `e2e/witness-challenge-lab.spec.ts`, docs, and two additional React routes in `src/App.tsx`. No homepage replacement, database migration, private API change, public participant record, stored data or background service.

**Human-approved implementation and public study launch are separate decisions.**
