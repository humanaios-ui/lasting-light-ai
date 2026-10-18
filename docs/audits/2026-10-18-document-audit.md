<!-- FDS: F13-Deliverable | Parent: operations#923 / lasting-light-ai#62 | Hawkins: internal-only | Status: ACTIVE -->

# ACAT and public-site source audit — initial receipt

**Audit date:** 2026-10-18  
**Repository baseline:** `humanaios-ui/lasting-light-ai` `main` at `6aa8f7ca685786775c200415255a480e52816e95`  
**Tree:** `daf7211e29b8a6c07ab6049c6458bc1b06ab9882` · **tracked files:** 329  
**Purpose:** First read-only census and evidence-backed contradiction list. This is not a complete semantic review, independent peer review, or deployment attestation.

Coordination: [operations#923](https://github.com/humanaios-ui/operations/issues/923), [humanaios#115](https://github.com/humanaios-ui/humanaios/issues/115), and [lasting-light-ai#62](https://github.com/humanaios-ui/lasting-light-ai/issues/62). The operations issue has an open draft implementation PR #924; its existence is not admission or review evidence.

## Census and coverage receipt

The source of truth for file membership and blob identity is the pinned Git tree above. The inventory is generated without shell path splitting:

```sh
python3 scripts/document_census.py > /tmp/lasting-light-ai-main-6aa8f7c.csv
```

The CSV has one row for each of the 329 tracked leaf objects, including dotfiles, with pinned revision, path, blob ID, mode, size, file category, visibility candidate, sensitivity, selected registry mapping, owner/generator resolution, source-coverage state, and independent-review state. It uses `git ls-tree -z` and `git cat-file --batch`; no untracked, ignored, inaccessible, or external files are silently counted as reviewed. Run the command again to reproduce the per-file coverage matrix. The audit additions are not part of the pinned census.

The row states are mutually exclusive and sum to 329:

| Source inspection state | Files | Meaning |
|---|---:|---|
| `inspected` | 8 | Entire text file read and summarized below |
| `evidence-linked` | 10 | Named source spans read and linked; remainder of each file is pending |
| `metadata-only` | 3 | Binary/media content not interpreted |
| `exception` with reason | 0 | None in this first pass |
| `pending` | 308 | No semantic-review claim |
| `blocked` | 0 | No tracked object was inaccessible in the pinned Git tree |
| **Total** | **329** | Exact pinned tree denominator |

`independent_review` is `PENDING` for every row. These counts describe source inspection only; they are not CodeRabbit review counts. The 3 metadata-only entries are the tracked DOCX, JPEG, and PNG assets. No symlinks or submodules occur in the pinned tree. The inventory tool does not decide licensing, sensitivity, source authority, generated-file ownership, or live deployment; these columns remain unresolved unless explicitly mapped.

Fully read files: `README.md`, `START_HERE.md`, `METHODS.md`, `VALIDATION_PLAN.md`, `PRIVACY.md`, `ai-instructions.txt`, `ACAT_PROMPT_V5_0.txt`, and `docs/EVIDENCE-GRAPH.md`. Partial source spans are recorded in the CSV; all other source, tests, fixtures, schemas, workflows, data, pages, and assets remain pending or metadata-only.

## Registry and runtime boundaries

The operations `document-registry.yaml` is the cross-repository control source, not a new local registry. I read the copy on operations `main` at commit `ad44c46f58beb5f3c7d9de1d248e7686795417dd` (blob `9c8bbfc386eb4922c79ab7339bca058f77bf6072`). It lists `METHODS.md` as `HAIOS-RES-002` and `VALIDATION_PLAN.md` as `HAIOS-PROC-002`, both canonical in this repo but in `review` state with `needs_reconcile: true`; the registry also lists `ACAT_PROMPT_V5_0.txt` as `HAIOS-RES-001` and `ai-instructions.txt` as `HAIOS-PROC-003`, both `review`. The CSV only maps these selected entries (plus the registered public methodology page); remaining registry IDs, approval history, generator ownership, and unregistered-file status have not been crosswalked.

The pinned repository contains distinct assessment surfaces: the React `/assess` route (`src/App.tsx:216-249`) and the static `public/assess.html` flow; `public/_redirects:1-6` includes legacy route redirects. Repository configuration and source do not prove which revision or route is presently served. An external request to `https://humanaios.ai` could not be resolved from this environment, so live paths, API health, deployed copy, and deployed behavior are **UNVERIFIED**.

## Evidence-linked claims and change candidates

Statuses distinguish an implementation trace from scientific support. Exact Phase 2 aggregate values in the legacy prompt are intentionally not reproduced here.

| Claim ID | Concept IDs | Claim/document span | Source locator(s), pinned at the repository SHA | Class / evidence state | Privacy / dependency / reviewer |
|---|---|---|---|---|---|
| `DI-PRIV-01` | `C-PRIVACY-COLLECTION` | `PRIVACY.md:5-20` says the assessment is client-side, has no server-side processing, and submissions use a form service. | `public/assess.html:1302-1374` constructs a submission and POSTs to Supabase and a second endpoint; `src/components/AcatTool.tsx:574-680` reads recent Supabase submissions and POSTs a payload. | Privacy/implementation. **CONTRADICTED by tracked implementations**; whether these exact files are deployed is unverified. | Public promise; affects both ACAT entrypoints, privacy copy, and collection/export documentation. Owner-routed correction proposal only; independent review **PENDING**. |
| `DI-METHOD-01` | `C-ACAT-DIMENSIONS`, `C-METHOD-VERSION` | `METHODS.md:3-8, 21-23, 47-80` presents version 0.1 as a draft, describes a six-dimension composite, and calls validation ongoing/planned. | `src/components/AcatTool.tsx:28-88` defines six core plus five extended dimensions; `README.md:27-39` separately describes core and extended dimensions. Operations registry entry `HAIOS-RES-002` is `review` and `needs_reconcile`. | Method/specification. **STALE/INCOMPLETE relative to tracked implementation and current README**; actual approved current method and scientific validation remain **UNVERIFIED**. | Research/public; dependencies include prompts, ACAT UI/schema, public methods and findings. Canonical owner review required; reviewer **PENDING**. |
| `DI-VAL-01` | `C-VALIDATION-PLAN`, `C-STUDY-STATUS` | `VALIDATION_PLAN.md:1-5, 16-24, 65-76` labels the v0.1 plan `CURRENT`, specifies a 60-assessment reliability design, and reports Phase 1 in progress. | Operations registry entry `HAIOS-PROC-002` is `review`, `needs_reconcile`, and recommends reconciliation before approval. `README.md:9-18` publishes a later dataset snapshot. | Study design/governance. **Status conflict requiring owner reconciliation**; repository evidence does not establish that the proposed study ran or that its planned protocol produced current dataset results. | Research; impacts validation reporting, methods, scoreboard and public research claims. Owner-routed proposal only; reviewer **PENDING**. |
| `DI-COUNT-01` | `C-DATASET-COUNTS`, `C-STAT-FALLBACKS` | `README.md:9-18` reports `N_total=629 / N_Phase1=516 / N_LI=307`. | Fallback constants in `src/components/AcatTool.tsx:276-315` and `public/index.html:862` instead use `N_total=630 / N_Phase1=517 / N_LI=308`; `public/observatory.html:524-548` also has alternate fallbacks. | Data/display implementation. **CONTRADICTED fallbacks**; runtime rows can override them, but the live snapshot and deployed result are **UNVERIFIED**. | Public aggregated data; reverse-impact candidates include README, React tool, homepage, observatory, visualizations and tests. Reviewer **PENDING**. |
| `DI-PROMPT-01` | `C-PHASE2-DISCLOSURE`, `C-PROMPT-VERSION` | `README.md:27-39` says Phase 2 uses directional language without exact means; the registry marks `ACAT_PROMPT_V5_0.txt` `review`. | `ACAT_PROMPT_V5_0.txt:43-116` embeds exact Phase 2 aggregate statistics; values omitted here under the Phase 2 handling rule. | Prompt/specification. **VERSION CONFLICT** in tracked material; prompt deployment status and primary data provenance are **UNVERIFIED**. | Restricted Phase 2 values not reproduced; prompt, instructions, assessment pages and tests are impact candidates. Reviewer **PENDING**. |
| `DI-LIVE-01` | `C-LIVE-DEPLOYMENT`, `C-API-STATUS` | `README.md:74-111` describes an externally deployed REST API and live routes. | No corresponding API service implementation was identified in this pass; repository evidence alone cannot establish a remote service's health or deployment. External site resolution failed in this session. | Production/runtime assertion. **UNVERIFIED**, not a claim that the service is unavailable. | Public; affects route and pipeline statements, site health displays, and collection instructions. Reviewer **PENDING**. |

`METHODS.md` and the validation plan are controlled canonical files per the operations registry. No changes were made to them or to `PRIVACY.md`; the entries above are review proposals, not amendments or approvals. The legacy prompt contains claims without independently linked source evidence in the portions reviewed; those claims are not treated as scientific findings. ACAT self-report or score changes do not establish capability, consciousness, or independent research validation.

The README's legacy assessment link has an in-repository redirect to the static assessment route. Do not treat that configured redirect as proof of a live redirect. The README, homepage, methods and public pages also contain public claims requiring owner and source review; potentially restricted partnership assertions were not copied into this report.

## Reverse-impact sample

**Change candidate:** revise or replace the static assessment submission route.  
**Potential review path:** `public/assess.html` → `public/_redirects` and `src/App.tsx` route parity → `src/components/AcatTool.tsx` and `src/components/AcatTool.test.tsx` / `e2e/assess.spec.ts` → `PRIVACY.md`, `README.md`, `METHODS.md`, `public/research.html`, and public collection guidance → Supabase/Apps Script destination and data-export behavior. This is a review queue, not a verified exhaustive dependency graph; the test files and backend were not fully inspected in this pass.

**Change candidate:** update the canonical dataset snapshot or calculation.  
**Potential review path:** authoritative source/filters → summary row and export → README → `src/components/AcatTool.tsx`, `public/index.html`, `public/observatory.html`, and `public/lumina_tide_pool_v2.html` → affected tests and generated/public pages. Data lineage and live refresh/regeneration are **PENDING**.

## Findings, gaps, and next review

- **VERIFIED against pinned source:** operations owns the controlled-document registry; the two controlled methods/validation documents are marked review and reconciliation-needed; tracked implementations contradict privacy copy; multiple fallback counts disagree with the README snapshot; the legacy prompt and README describe different Phase 2 exposure; separate React and static collection paths exist.
- **UNVERIFIED:** scientific evidence for claims; whether historical protocols were executed; provenance/currentness of the live snapshot; privacy/data retention and consent beyond these files; external API deployment and live page behavior; authorizations, runtime RLS, export coverage, and generated-page regeneration.
- **PENDING cross-repository projections:** Evidence/Intent/Longitudinal/Temporal/Repository Graph/SCVC projections were not inspected or imported. This receipt is a local, read-only evidence table, not an admitted graph projection.
- **PENDING:** semantic inspection of 308 files; full controlled-document crosswalk; full claims/dependencies graph; licensing and data-subject review; targeted tests for stale/conflicting/missing sources and regeneration; protected CI at the resulting PR head; authenticated approval; CodeRabbit review and review references.
- **Independent review:** No CodeRabbit receipt or independent full-repository review was observed. Any later PR review covers only its reviewed diff and must not be represented as attestation of untouched files.

No graph, registry, canonical research statement, score threshold, or public privacy promise was modified. Continue with small, owner-routed review batches and retain every source/revision and pending disposition.
