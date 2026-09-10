<!-- FDS: F2-BuildingBlock | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE -->

# Frontend Canonical Model

## Canonical source of truth

- `/home/runner/work/lasting-light-ai/lasting-light-ai/src/**` is the canonical source for React/Vite UI logic.
- `/home/runner/work/lasting-light-ai/lasting-light-ai/public/**` is the canonical source for standalone static pages deployed at route-level HTML paths (for example `assess.html`, `observatory.html`).

## Frozen legacy surfaces

- Root-level duplicated static pages (outside `public/`) are legacy compatibility mirrors and must be treated as frozen unless a migration task explicitly requires parity updates.
- New product behavior must be implemented in one canonical surface only, then migrated intentionally if a mirror is still required.

## Drift-control policy

1. Do not copy compiled/transpiled source into static HTML pages.
2. Do not paste Markdown code fences into executable HTML/CSS/JS assets.
3. Any new route must declare whether it is React-routed (`src`) or standalone (`public`) before implementation.
4. Security fixes must land first on canonical high-traffic pages (`public/index.html`, `public/observatory.html`, `public/assess.html`).
