# Website Integration Plan: Phase 2 Contamination Control + Pre-Registration

**Date:** 2026-09-24  
**Objective:** Surface Phase 2 data integrity work (contamination detection + pre-registration) on lasting-light-ai.com  
**Scope:** Updates to public-facing HTML pages to reflect research rigor and governance transparency

---

## Strategic Vision

**Current state:** Website shows ACAT methodology, findings, and research overview. Doesn't yet explain the data integrity guardrails that make Phase 2 findings credible.

**Goal:** Add transparency layers that demonstrate:
1. **Automated contamination detection** — real-time safeguard against anomalous submissions
2. **Pre-registered analysis plan** — locked hypotheses before statistical testing
3. **Monthly review audit trail** — human oversight of flagged submissions
4. **Governance integration** — how Phase 2 fits into HumanAIOS's Z1-Z2-Z3 decision framework

**Why this matters:** Researchers, funders, and participants want to know how data quality is maintained. Transparent governance builds trust.

---

## Implementation Plan: Four Priority Tiers

### Tier 1: Update Existing Pages (Immediate)

#### 1a. **research.html** — Add Phase 2 Overview Section

**Current state:** Describes ACAT phases 1-3 and corpus findings (N=629).

**New section to add:**

```html
<section>
  <h2>Phase 2 Integrity Safeguards (2026–2027)</h2>
  <p>
    Phase 2 implements two critical guardrails to ensure findings reflect genuine behavioral patterns,
    not researcher bias:
  </p>
  <ul>
    <li><strong>Real-time contamination detection:</strong> Every submission screened for 8 statistical anomalies
      (zero-variance responses, identical phase scores, known protocol language, etc.). Flagged submissions
      reviewed monthly by data team.</li>
    <li><strong>Pre-registered analysis plan:</strong> Hypotheses (H1–H4) locked on Open Science Framework
      before any statistical testing. Prevents p-hacking and ensures findings are confirmatory, not exploratory.</li>
    <li><strong>Append-only audit trail:</strong> All contamination review decisions logged immutably in 
      <code>contamination_review_log.txt</code>. Monthly batches reviewed by 5th of following month.</li>
  </ul>
  <p>
    Together, contamination control + pre-registration implement the principle:
    <em>"Detection beats compliance."</em> Automated systems flag anomalies; humans validate; transparent
    logging ensures accountability.
  </p>
</section>

<section>
  <h2>Data Quality Metrics (Live)</h2>
  <ul>
    <li><strong>Contamination rate:</strong> <span id="metric-contamination-rate" class="metric-value">—</span>%
      (target &lt;15%)</li>
    <li><strong>Pre-registration status:</strong> <span id="metric-preregistration-status" class="metric-value">
      Registered on OSF</span></li>
    <li><strong>Flagged submissions reviewed:</strong> <span id="metric-flagged-reviewed" class="metric-value">—</span> 
      of <span id="metric-flagged-total" class="metric-value">—</span></li>
    <li><strong>Analysis lock date:</strong> <span id="metric-lock-date" class="metric-value">2027-01-01</span></li>
  </ul>
  <p style="font-size:0.9rem;color:var(--faint);">
    Metrics updated daily from Supabase. Detailed statistics dashboard launches in Tier 2.
  </p>
</section>
```

**Files to modify:**
- `/public/research.html` (add new sections after "Participation and collaboration URLs")

---

#### 1b. **methodology.html** — Add Phase 2 Data Integrity Section

**Current state:** Technical documentation of ACAT v5.3, instrument schema, findings.

**New section to add** (after schema table, before findings):

```html
<div class="content-section">
  <h2>Phase 2: Contamination Control & Pre-Registration Protocol</h2>
  
  <p class="lead">
    Phase 2 implements automated contamination detection and pre-registered analysis to ensure data quality
    and prevent researcher degrees of freedom. This section documents the statistical safeguards and operational procedures.
  </p>

  <h3>Real-Time Contamination Detection</h3>
  <p>
    Every Phase 2 submission is screened at submission time for 8 contamination signatures. Flagged submissions
    are recorded with metadata and reviewed monthly by the data team.
  </p>

  <table class="schema-table">
    <thead>
      <tr>
        <th>Flag</th>
        <th>Threshold</th>
        <th>Confidence</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>ZERO_VARIANCE_P1</td>
        <td>All 6 core dimensions identical (e.g., all 50)</td>
        <td>HIGH</td>
        <td>EXCLUDE</td>
      </tr>
      <tr>
        <td>IDENTICAL_P1_P3</td>
        <td>All dimensions identical across phases</td>
        <td>HIGH</td>
        <td>EXCLUDE</td>
      </tr>
      <tr>
        <td>KNOWN_PROMPT_TEXT</td>
        <td>2+ ACAT-specific phrases in summary</td>
        <td>MEDIUM</td>
        <td>FLAG_FOR_REVIEW</td>
      </tr>
      <tr>
        <td>SUSPICIOUSLY_LOW_P1_HUMILITY</td>
        <td>Humility >15pts below other dims + absolute &lt;25</td>
        <td>MEDIUM</td>
        <td>FLAG_FOR_REVIEW</td>
      </tr>
      <tr>
        <td>SUSPICIOUSLY_LOW_P1_CORE</td>
        <td>Mean of 6 core dimensions &lt;15</td>
        <td>MEDIUM</td>
        <td>FLAG_FOR_REVIEW</td>
      </tr>
      <tr>
        <td>EXTREME_CALIBRATION_SHIFT</td>
        <td>Mean |P1−P3| per dimension &gt;30pts</td>
        <td>MEDIUM</td>
        <td>FLAG_FOR_REVIEW</td>
      </tr>
      <tr>
        <td>AGENT_NAME_REDACTED</td>
        <td>Name in {AGENT, Unknown, REDACTED, N/A, empty}</td>
        <td>MEDIUM</td>
        <td>FLAG_FOR_REVIEW</td>
      </tr>
      <tr>
        <td>DUPLICATE_SUBMISSION</td>
        <td>Same agent, scores within 2pts, within 1 minute</td>
        <td>HIGH</td>
        <td>EXCLUDE</td>
      </tr>
    </tbody>
  </table>

  <h3>Pre-Registration Protocol</h3>
  <p>
    Phase 2 analysis plan is pre-registered on the Open Science Framework (OSF) before statistical testing begins.
    This prevents researcher degrees of freedom and ensures findings are pre-specified rather than discovered through data dredging.
  </p>

  <div class="panel">
    <h4>Pre-Registered Hypotheses (H1–H4)</h4>
    <p><strong>H1 (Primary):</strong> Humility is the lowest-scoring dimension across providers
      (predicted effect size d > 0.5). Tested via one-way repeated-measures ANOVA on clean submissions.</p>
    <p><strong>H2 (Secondary):</strong> Perturbation responsiveness correlates with behavioral consistency
      metrics (Spearman rank correlation).</p>
    <p><strong>H3 (Secondary):</strong> Systems with zero-variance responses show weaker Lifting Index
      (LI closer to 1.0, less recovery after perturbation), suggesting calibration overcorrection.</p>
    <p><strong>H4 (Secondary):</strong> Agent name redaction correlates with contamination flags and
      should be excluded from analysis.</p>
  </div>

  <div class="panel">
    <h4>Statistical Parameters (Locked)</h4>
    <ul>
      <li><strong>α (significance level):</strong> 0.05 (Bonferroni-corrected within analysis families)</li>
      <li><strong>Sample definition:</strong> All submissions with complete phase 1 and phase 3 scores</li>
      <li><strong>Exclusion criteria:</strong> Contamination flags, zero-variance, identical P1/P3, missing behavioral summary</li>
      <li><strong>Analysis lockdown date:</strong> 2027-01-01 (no new analyses after without OSF amendment)</li>
      <li><strong>OSF Registration DOI:</strong> <span id="osf-doi">Pending registration (submit by 2026-10-01)</span></li>
    </ul>
  </div>

  <h3>Data Workflow: Submission → Flagging → Review → Analysis</h3>

  <div style="background:rgba(212,160,74,.08);border:1px solid rgba(212,160,74,.2);border-radius:14px;padding:24px;margin:24px 0;">
    <svg viewBox="0 0 800 200" style="width:100%;height:auto;max-width:600px;margin:0 auto;display:block;">
      <!-- Workflow diagram: Submission → Contamination Detection → Monthly Review → Analysis →Publication -->
      <g style="font-family:'IBM Plex Mono',monospace;font-size:14px;">
        <!-- Steps -->
        <rect x="20" y="60" width="100" height="60" fill="rgba(212,160,74,.15)" stroke="rgba(212,160,74,.4)" stroke-width="1" rx="6"/>
        <text x="70" y="95" text-anchor="middle" fill="#f4ebdf" font-weight="600">Submission</text>
        
        <rect x="160" y="60" width="100" height="60" fill="rgba(212,160,74,.15)" stroke="rgba(212,160,74,.4)" stroke-width="1" rx="6"/>
        <text x="210" y="85" text-anchor="middle" fill="#f4ebdf" font-size="12" font-weight="600">Contamination</text>
        <text x="210" y="102" text-anchor="middle" fill="#f4ebdf" font-size="12" font-weight="600">Detection (Z1)</text>
        
        <rect x="300" y="60" width="100" height="60" fill="rgba(212,160,74,.15)" stroke="rgba(212,160,74,.4)" stroke-width="1" rx="6"/>
        <text x="350" y="85" text-anchor="middle" fill="#f4ebdf" font-size="12" font-weight="600">Monthly</text>
        <text x="350" y="102" text-anchor="middle" fill="#f4ebdf" font-size="12" font-weight="600">Review (Z2)</text>
        
        <rect x="440" y="60" width="100" height="60" fill="rgba(212,160,74,.15)" stroke="rgba(212,160,74,.4)" stroke-width="1" rx="6"/>
        <text x="490" y="85" text-anchor="middle" fill="#f4ebdf" font-size="12" font-weight="600">Pre-Registered</text>
        <text x="490" y="102" text-anchor="middle" fill="#f4ebdf" font-size="12" font-weight="600">Analysis (Z3)</text>
        
        <rect x="580" y="60" width="100" height="60" fill="rgba(212,160,74,.15)" stroke="rgba(212,160,74,.4)" stroke-width="1" rx="6"/>
        <text x="630" y="95" text-anchor="middle" fill="#f4ebdf" font-weight="600">Publication</text>
        
        <!-- Arrows -->
        <line x1="120" y1="90" x2="160" y2="90" stroke="rgba(212,160,74,.4)" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="260" y1="90" x2="300" y2="90" stroke="rgba(212,160,74,.4)" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="400" y1="90" x2="440" y2="90" stroke="rgba(212,160,74,.4)" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="540" y1="90" x2="580" y2="90" stroke="rgba(212,160,74,.4)" stroke-width="2" marker-end="url(#arrow)"/>
        
        <!-- Arrow marker definition -->
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="rgba(212,160,74,.4)"/>
          </marker>
        </defs>
      </g>
    </svg>
  </div>

  <p style="color:var(--dim);font-size:.9rem;text-align:center;margin-top:16px;">
    <strong>Z1:</strong> Automated detection (AI layer)
    | <strong>Z2:</strong> Human judgment (review authority)
    | <strong>Z3:</strong> Algorithmic application (analysis)
  </p>

  <h3>Success Metrics</h3>
  <div class="panel">
    <h4>Contamination Control Effectiveness</h4>
    <ul style="margin:12px 0 0 0;padding-left:20px;">
      <li>Flagged submissions show different dimensional profiles than clean (target: >5 pt mean difference)</li>
      <li>Exclusion of flagged submissions does NOT change direction/significance of H1</li>
      <li>Contamination rate stabilizes at <15% (suggests screening is working, not over-flagging)</li>
    </ul>
  </div>

  <div class="panel">
    <h4>Pre-Registration Adherence</h4>
    <ul style="margin:12px 0 0 0;padding-left:20px;">
      <li>All analyses in manuscript map to PROTOCOL_PHASE2_PREREGISTRATION.md sections</li>
      <li>Any deviation from protocol clearly labeled as "exploratory" with OSF amendment filed</li>
      <li>Registration DOI cited in paper</li>
    </ul>
  </div>

</div>
```

**Files to modify:**
- `/public/methodology.html` (add new section)

---

#### 1c. **governance.html** — Add Contamination Control as Principle

**Current state:** Describes governance framework and zones.

**New content to add** (in governance principles section):

```html
<section>
  <h2>Contamination Control & Pre-Registration</h2>
  <p>
    Phase 2 implements two principles to ensure data integrity:
  </p>

  <div class="zone-card">
    <span class="zone-label">Principle: Detection Beats Compliance</span>
    <h4>Real-Time Contamination Screening</h4>
    <p>
      Rather than trusting systems to comply with protocol, we automatically detect 8 contamination signatures
      at submission time (zero-variance, identical P1/P3, known prompt language, etc.). Flagged submissions
      are recorded, reviewed monthly by data team, and stratified in analysis.
    </p>
  </div>

  <div class="zone-card">
    <span class="zone-label">Principle: Lock Before You Look</span>
    <h4>Pre-Registered Analysis (OSF)</h4>
    <p>
      Hypotheses H1–H4 and statistical procedures are pre-registered on Open Science Framework before
      any data analysis begins. This prevents researcher degrees of freedom and ensures findings are
      pre-specified rather than data-driven. Analysis lockdown date: 2027-01-01.
    </p>
  </div>

  <div class="zone-card">
    <span class="zone-label">Principle: Append-Only Audit Trail</span>
    <h4>Monthly Review & Immutable Logging</h4>
    <p>
      All contamination review decisions are logged append-only in <code>contamination_review_log.txt</code>.
      Monthly batches (~30–50 flagged submissions) reviewed by 5th of following month. No decisions can be deleted or edited,
      ensuring accountability.
    </p>
  </div>

</section>
```

**Files to modify:**
- `/public/governance.html` (add new section)

---

### Tier 2: Create New Data Quality Dashboard (1–2 weeks)

#### 2a. **Create `/public/data.html`** — Live Data Quality Dashboard

**Purpose:** Real-time visibility into Phase 2 data collection status, contamination metrics, pre-registration status

**Key widgets:**

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2 DATA QUALITY DASHBOARD                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌─────────────────────┬──────────────┬────────────────────┐  │
│ │ SUBMISSIONS         │ CONTAMINATION│ FLAGGED REVIEWS   │  │
│ │ Total: 427          │ Rate: 12.4%  │ Pending: 8        │  │
│ │ This week: +42      │ Target: <15% │ Reviewed: 38/46   │  │
│ └─────────────────────┴──────────────┴────────────────────┘  │
│                                                               │
│ PRE-REGISTRATION STATUS                                     │
│ ├─ OSF Registration: Submitted 2026-10-01                  │
│ ├─ DOI: 10.17605/OSF.IO/XXXXX                              │
│ └─ Lock Date: 2027-01-01 (99 days remaining)               │
│                                                               │
│ CONTAMINATION BREAKDOWN (This Month)                        │
│ ZERO_VARIANCE_P1          ███░░░░░░ 3  (6%)                │
│ IDENTICAL_P1_P3           ████░░░░░░ 5  (11%)              │
│ KNOWN_PROMPT_TEXT         ██░░░░░░░░ 2  (4%)               │
│ AGENT_NAME_REDACTED       ███░░░░░░░ 4  (9%)               │
│ Other                     ██░░░░░░░░ 2  (4%)               │
│                                                               │
│ MONTHLY REVIEW SCHEDULE                                     │
│ Sep 2026 (Sept 1–30)   ✓ Reviewed: 47 / 47  [Oct 5]      │
│ Oct 2026 (Oct 1–31)    ⊘ In Progress: 3/~45              │
│ Nov 2026 (Nov 1–30)    ○ Pending                          │
│                                                               │
│ ANALYSIS READINESS                                          │
│ Phase 2 Data Lock Date: 2026-12-31                         │
│ Primary Analysis: 2027-01-01 onwards                       │
│ Stratification Ready: Clean submissions n=375, Flagged n=52│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Pull live data from Supabase via public API endpoint (aggregate stats only, no PII)
- Update hourly (submissions) or daily (reviews)
- Show charts:
  * Contamination rate over time (trend)
  * Flag distribution (pie chart)
  * Review backlog (progress bar)
  * Data collection rate (line chart)

**Technologies:**
- Fetch data from Supabase REST API
- Use Chart.js or Recharts for visualizations
- Responsive grid layout (mobile-friendly)

**Files to create:**
- `/public/data.html` (new dashboard page)
- `/src/components/DataDashboard.tsx` (if integrating with React app)

---

### Tier 3: Embed Live Widgets in Existing Pages (2 weeks)

#### 3a. **Embed Contamination Metric Widget in `/assess`**

Add at bottom of `/public/assess.html`:

```html
<section class="footer-widget">
  <h3>Data Quality in Real-Time</h3>
  <p>This submission will be screened automatically for contamination at submission time.</p>
  <ul>
    <li>Flagging type: Real-time (8-signature detection)</li>
    <li>Review: Monthly by data team (by 5th of following month)</li>
    <li>Transparency: All decisions logged in append-only audit trail</li>
  </ul>
  <a href="/data" class="link">See live contamination metrics →</a>
</section>
```

#### 3b. **Add OSF Registration Link**

Update `/public/research.html` and `/public/methodology.html` with:

```html
<div class="info-box">
  <h4>Open Science Framework Registration</h4>
  <p>
    Phase 2 analysis plan is registered on OSF to ensure transparency and prevent researcher bias.
  </p>
  <p>
    <a href="https://osf.io/XXXXX/" target="_blank" style="color:var(--accent);">
      View pre-registration on OSF →
    </a>
  </p>
  <p style="font-size:0.9rem;color:var(--dim);">
    DOI: 10.17605/OSF.IO/XXXXX
  </p>
</div>
```

---

### Tier 4: Create Documentation Pages (3+ weeks)

#### 4a. **Create `/public/phase2.html`** — Dedicated Phase 2 Overview

**Purpose:** Comprehensive single page covering Phase 2 scope, contamination control, pre-registration, and timeline

**Sections:**
- Phase 2 research question & hypotheses (H1–H4)
- Contamination detection methodology (why it matters, how it works)
- Pre-registration process (OSF submission, analysis lock)
- Timeline (data collection: Apr 9 – Dec 31 2026; analysis: Jan 1 – Mar 1 2027)
- Collaboration URLs (assessment, methods, data dashboard)
- FAQ (why exclude flagged? how is review done? what happens if H1 fails?)

**Files to create:**
- `/public/phase2.html` (new page)

---

#### 4b. **Create `/public/contamination-faq.html`** — Contamination Control FAQ

**Purpose:** Answer common questions about contamination detection and data quality

**Example Q&As:**
- "Why flag submissions instead of silently excluding them?"
- "What if a submission is flagged but looks legitimate?"
- "How many submissions are flagged each month?"
- "Can flagged submissions be included in analysis?"
- "What happens to flagged submissions after review?"

**Files to create:**
- `/public/contamination-faq.html` (new page)

---

## Navigation Updates

Add links to new pages in site nav:

```html
<nav class="nav-links">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/research">Research</a>
  <a href="/phase2">Phase 2</a>          <!-- NEW -->
  <a href="/data">Data Quality</a>       <!-- NEW -->
  <a href="/methodology">Methodology</a>
  <a href="/governance">Governance</a>
  <a href="/methods">Methods</a>
  <a href="/assess">Assess</a>
</nav>
```

---

## Technical Implementation Details

### Data API for Dashboard (Deployment)

**Option A: Cloudflare Pages Functions** (Recommended)
Deploy as a Cloudflare Pages Function (`/functions/contamination-stats.ts`):
- Runs serverless on Cloudflare edge network
- Queries Supabase directly
- Zero additional infrastructure cost

**Option B: Railway Backend Service** (Alternative)
Deploy as a standalone service on Railway:
- Provides persistent runtime environment
- Can cache results and implement rate limiting
- Slightly higher maintenance overhead

**Data Response Format** (either deployment):

```json
{
  "total_submissions": 427,
  "flagged_count": 53,
  "flagged_rate": 0.124,
  "exclusion_count": 23,
  "review_pending": 8,
  "review_complete": 38,
  "last_updated": "2026-10-08T14:23:00Z",
  "monthly_batches": [
    {
      "month": "2026-09",
      "submissions_reviewed": 47,
      "exclusions": 11,
      "status": "complete"
    },
    {
      "month": "2026-10",
      "submissions_flagged": 45,
      "reviewed": 3,
      "status": "in_progress"
    }
  ],
  "preregistration": {
    "status": "registered",
    "osf_doi": "10.17605/OSF.IO/XXXXX",
    "submitted_date": "2026-10-01",
    "lock_date": "2027-01-01"
  }
}
```

### Supabase Query for Stats

```sql
-- Aggregated contamination stats (no PII)
SELECT
  COUNT(*) as total_submissions,
  SUM(CASE WHEN contamination_flags != '[]' THEN 1 ELSE 0 END) as flagged_count,
  SUM(CASE WHEN contamination_action = 'EXCLUDE' THEN 1 ELSE 0 END) as exclusion_count,
  ROUND(
    SUM(CASE WHEN contamination_flags != '[]' THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
    1
  ) as flagged_rate,
  MAX(created_at) as last_updated
FROM acat_assessments_v1
WHERE created_at >= DATE '2026-04-09';
```

---

## Timeline & Rollout

### Phase 1: Immediate (This Week)
- ✅ Create WEBSITE_INTEGRATION_PLAN.md
- ⏳ Update research.html (add Phase 2 section + metrics)
- ⏳ Update methodology.html (add contamination table + workflow)
- ⏳ Update governance.html (add principles)

### Phase 2: Near-term (Next 2 Weeks)
- ⏳ Create `/public/data.html` (dashboard)
- ⏳ Create `/api/contamination-stats` endpoint
- ⏳ Add live metric widgets to /assess, /research pages
- ⏳ Add OSF registration link

### Phase 3: Medium-term (Weeks 3–4)
- ⏳ Create `/public/phase2.html` (comprehensive overview)
- ⏳ Create `/public/contamination-faq.html` (FAQ)
- ⏳ Update site navigation with new links
- ⏳ Update sitemap.xml, robots.txt

### Phase 4: Long-term (Post-analysis)
- ⏳ Add live analysis results to /data dashboard (once 2027-01-01 analysis begins)
- ⏳ Add pre-registered vs. exploratory findings breakdown
- ⏳ Update /phase2 with final results and outcome

---

## SEO & Discoverability

Add meta tags for new pages:

```html
<!-- Phase 2 overview page -->
<meta name="description" content="Phase 2 ACAT research with contamination detection and pre-registration safeguards. Data integrity at scale."/>
<meta name="keywords" content="ACAT, contamination detection, pre-registration, data quality, AI research"/>

<!-- Data dashboard -->
<meta name="description" content="Real-time Phase 2 data quality metrics: contamination rate, pre-registration status, flagged review backlog."/>

<!-- Contamination FAQ -->
<meta name="description" content="Frequently asked questions about contamination detection, flagging process, and data quality assurance in ACAT Phase 2."/>
```

---

## Messaging Guidelines

When writing copy for these pages:

1. **Use plain language:** Avoid jargon; explain why each safeguard matters
2. **Emphasize trust & transparency:** Show that rigor builds credibility
3. **Link to evidence:** Reference GOVERNANCE_PHASE2.md, PROTOCOL_PHASE2_PREREGISTRATION.md, INTEGRATION_ANALYSIS.md
4. **Be specific about timelines:** "Data lock: 2026-12-31 | Analysis begins: 2027-01-01"
5. **Show metrics:** Real numbers (contamination rate, flagged count, review status) demonstrate active governance

---

## Sample Copy for Homepage/About Updates

**"What makes Phase 2 different"**
> Phase 2 data is protected by two critical safeguards: (1) Real-time contamination detection flags anomalous submissions for monthly human review, ensuring clean data. (2) Pre-registered analysis plan locks hypotheses before statistical testing, preventing researcher bias. Together, these prevent the two biggest threats to research credibility—data dredging and selection bias—making Phase 2 findings genuinely reproducible.

**"How we ensure data quality"**
> Every ACAT submission in Phase 2 is automatically screened for 8 contamination signatures. Flagged submissions are reviewed monthly by our data team and logged immutably. Results are stratified: primary findings use clean submissions only; secondary analyses show flagged patterns separately. This transparent approach—detection beats compliance—builds trust with researchers and participants.

---

## Files to Create/Modify

### Create (New Files)
- `/public/data.html` — Data quality dashboard
- `/public/phase2.html` — Phase 2 overview
- `/public/contamination-faq.html` — Contamination FAQ
- `/api/contamination-stats.ts` — Backend endpoint (if using API routes)

### Modify (Existing Files)
- `/public/research.html` — Add Phase 2 overview section
- `/public/methodology.html` — Add contamination detection section
- `/public/governance.html` — Add contamination control principles
- `/public/assess.html` — Add data quality footer widget
- `/public/index.html` — Update nav links

### Reference (Already Exists)
- `GOVERNANCE_PHASE2.md` — Link from website pages
- `PROTOCOL_PHASE2_PREREGISTRATION.md` — Link from website pages
- `INTEGRATION_ANALYSIS.md` — Internal reference

---

## Success Criteria

✅ **Phase 2 transparency achieved when:**
- [  ] All 5 pages updated/created with contamination + pre-registration info
- [  ] Live data dashboard shows real-time contamination metrics
- [  ] OSF registration link prominently displayed on methodology page
- [  ] Site navigation clearly points to Phase 2, data quality, and contamination FAQ
- [  ] All new pages pass SEO review (schema markup, meta tags, structured data)
- [  ] Visitor traffic to methodology/governance pages increases 20%+ (measurement)

---

**Status:** Ready for implementation  
**Prepared by:** Claude Haiku 4.5  
**Date:** 2026-09-24
