# HumanAIOS Living Attractor — E0 | The Human-Centered Constellation

**Admission:** Z1 DRAFT / HOLD. **Authority effect:** NONE. **Execution:** DISABLED. **Merge:** NOT AUTHORIZED. **Deployment:** NOT AUTHORIZED.
**Issue:** #69 in `humanaios-ui/lasting-light-ai`. This is a stand-alone public workbench; the existing homepage at `/` is unchanged.

## Human purpose
Make the user's supplied sunrise/human-journey and gold-and-blue Witness images a future visual foundation for a useful HumanAIOS.ai attractor node, rather than an unverified telemetry illustration. The E0 implementation supplies an accessible, interactive visual field with a real navigation/evidence boundary.

## Exact E0 entry point
- Public preview page: `public/ecosystem.html` => `/ecosystem.html`.
- Cloudflare Pages redirect: `/ecosystem` => `/ecosystem.html` (302). Local Vite preview does not apply Cloudflare redirects; use `/ecosystem.html` locally.
- Styles: `public/ecosystem-attractor.css`.
- Source/interaction kernel: `public/ecosystem-attractor.mjs`.
- Reused existing repository-approved Witness artwork blob `assets/brand/humanaios-witness.jpg` as `public/ecosystem-witness.jpg`; exact same Git blob, no new image-generation claim.
- E0 skyline, path and orbit are CSS/SVG decoration, not measured scientific outputs.

### Image provenance and next visual step
The two user-supplied images from the conversation (`IMG_0839.jpeg`, `IMG_0544(1).png`) were inspected as artistic references but **are not yet in this GitHub PR**. The GitHub connector cannot directly transfer a conversation-local binary into the remote repository. Do not claim the original poster or emblem was copied. A later authorized assets-only change should add optimized owned copies to `public/ecosystem-assets/`, preserving credit/approval, alt text, mobile crop and baseline bundle size. Until then, the page uses local existing Witness art and a functional, responsive vector-inspired skyline. Replacing an image must not change page authority or behavior.

## Node wiring and boundaries
| Node | Actual destination | Evidence/authority limit |
| --- | --- | --- |
| Witness | `/witness.html` | Public examination material; no certification |
| Resource Miner | `/funding.html` | Public overview only; private miner not directly exposed |
| INTENT-OS | operations issue #1084 | Private records remain protected; issue is not an app |
| Project Desk | operations draft PR #1086 | Proposed reconciliation only; no synchronization |
| Operations Observatory | operations PR #1089 | Draft workbench source; not deployed live telemetry |
| Human Hub | `/the-commons.html` | Public community page; no verified matching |
| ACAT | `/assess.html` | Self-report research, not consciousness proof |
| Recovery & Impact | `/why-it-matters.html` | Mission, not audited benefit or payout |

Every interactive node is a button with `aria-pressed`, visible source/limit text and one real navigation link. The Witness asks deterministic, preauthored questions; it does not call an AI API or record conversations.

## Telemetry and living motion
- One browser read at page load plus **manual** refresh; never an unbounded background poll.
- Exactly **three** allowlisted public GitHub issue endpoints, one page with maximum **five most recently updated records each**. Source URL canonically checked, source title written via `textContent` (no HTML injection).
- A `recent_sample_size` counts how many of those up to five sampled records were last updated in 28 days. It is **not** the total number of issues, commits, approvals or actual change events in that period.
- Checked-at timestamp in UTC, latest record URL, type and timestamp are displayed; API failures or malformed records are visibly unavailable/partial.
- Motion is decorative. Successful source reads change a glow, but never display the system as healthy, complete, verified, compliant or conscious.
- No private endpoints, tokens, local storage, cookies, analytics, POST, applications, model memories, or Project Desk writes.

## Local preview — steps
1. Checkout the E0 review branch; **do not merge or deploy**.
2. `npm ci` (existing project dependencies; Node 22 in CI).
3. `npm run dev -- --host 127.0.0.1 --port 4173`.
4. Open `http://127.0.0.1:4173/ecosystem.html`.
5. Select each of eight nodes. Verify the human-readable status and exact public destination.
6. Refresh the three GitHub source samples; verify timestamp, capped coverage and canonical links. Disconnect network; unavailable is a correct result.
7. Test 390px-width iPhone layout, keyboard, focus, and reduced-motion preference.
8. Run validation, independent exact-head review, and visual comparison to both supplied image references. The current homepage must remain unchanged.

## Tests
```sh
npm run test:attractor
npm run lint
npm run typecheck
npm run test:run
npm run build
npx playwright test e2e/ecosystem-attractor.spec.ts
```
The new contract tests are run by the existing Frontend Quality Gates workflow. The Playwright suite is included in its E2E discovery. CI is evidence about these checks, not human admission.

## Non-goals and follow-up
- Do not replace `/`, change ACAT calibration data, or open authenticated INTENT-OS.
- Do not infer machine health, recovery benefit, task completion or governance approval from GitHub timestamps.
- Do not create a competing memory system or Project Desk write bridge.
- E1 only after human review: integrate optimized original user art; decide which existing website surface is the canonical homepage; assess first-visitor comprehension and accessible navigation; add independently verified, read-only evidence adapter if justified.

## Rollback
Revert or discard the draft branch/PR. Its only changes outside newly added files are the `/ecosystem` redirect, an additional test script, and a PR test command; no persisted data or schema migration. Cloudflare deploy remains on `main` pushes, which E0 does not perform.
