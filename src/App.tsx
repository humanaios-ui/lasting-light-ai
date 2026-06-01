import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { TideCanvas } from './components/TideCanvas';
import { WitnessNav } from './components/WitnessNav';
import { TideRail } from './components/TideRail';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { DimensionsGrid } from './components/DimensionsGrid';
import { LiveDataSection } from './components/LiveDataSection';
import { SigilsSection } from './components/SigilsSection';
import { SiteMap } from './components/SiteMap';
import { Footer } from './components/Footer';
import { AcatTool } from './components/AcatTool';

// ── Nav link data — mirrors witness-nav.js NAV_GROUPS ──────────────────────
const NAV_GROUPS = [
  {
    label: 'UNDERSTAND',
    items: [
      { href: '/research',           name: 'Research',        desc: 'What ACAT measures and current findings' },
      { href: '/methods',            name: 'Methods',         desc: 'Three-phase protocol and analysis details' },
      { href: '/about',              name: 'About',           desc: 'Three-entity structure and mission' },
    ],
  },
  {
    label: 'EXPLORE',
    items: [
      { href: '/observatory.html',         name: 'Observatory',       desc: 'Live dataset visualization' },
      { href: '/lantern-room.html',         name: 'Lantern Room',      desc: 'Calibration gap analysis' },
      { href: '/observability-garden.html', name: 'Garden',            desc: 'Behavioral bloom visualization' },
    ],
  },
  {
    label: 'PARTICIPATE',
    items: [
      { href: '/assess',             name: 'Submit ACAT',  desc: 'Run a calibration · ~20 min', cta: true },
      { href: '/acat-enterprise.html', name: 'Enterprise', desc: 'Structured audit for deployed AI' },
    ],
  },
];

// ── Top navigation bar ──────────────────────────────────────────────────────
function TopNav({ meanLI }: { meanLI: number }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(16px)',
        background: 'rgba(15,14,12,0.92)',
        borderBottom: '1px solid rgba(212,160,74,0.18)',
      }}
    >
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60,
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            display: 'grid', placeItems: 'center',
            border: '1px solid rgba(212,160,74,0.35)',
            background: 'linear-gradient(145deg,rgba(212,160,74,0.2),rgba(212,160,74,0.04))',
            color: '#d4a04a', fontWeight: 700, fontSize: '1rem',
          }}>◌</div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.02em', color: '#f4ebdf' }}>
              HumanAIOS
            </div>
            <div style={{ fontSize: '0.72rem', color: '#7a7268', letterSpacing: '0.04em' }}>
              μ LI = {meanLI.toFixed(4)}
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}
          aria-label="Primary navigation">
          {NAV_GROUPS.map(group =>
            group.items.map(item => {
              const isInternal = item.href.startsWith('/assess');
              const active = isInternal
                ? location.pathname === '/assess'
                : false;

              const baseStyle: React.CSSProperties = {
                padding: '7px 12px', borderRadius: 999,
                border: '1px solid transparent',
                textDecoration: 'none', fontSize: '0.88rem',
                color: active ? '#f4ebdf' : '#c2b8a6',
                background: active ? 'rgba(212,160,74,0.1)' : 'transparent',
                transition: '0.15s',
                ...(item.cta ? {
                  background: 'linear-gradient(180deg,#f1c36e,#d4a04a)',
                  color: '#0f0e0c', fontWeight: 700,
                  border: '1px solid transparent',
                } : {}),
              };

              if (isInternal) {
                return (
                  <Link key={item.href} to="/assess" style={baseStyle}>
                    {item.name}
                  </Link>
                );
              }
              return (
                <a key={item.href} href={item.href} style={baseStyle}>
                  {item.name}
                </a>
              );
            })
          )}
        </nav>
      </div>
    </header>
  );
}

// ── Home page (all existing sections) ──────────────────────────────────────
function HomePage({ onNavigate }: { onNavigate: (v: 'home' | 'acat') => void }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <ProblemSection />
      <DimensionsGrid />
      <LiveDataSection />

      {/* Research Depth Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-accent-amber-dim" />
            <span className="font-mono text-[11px] tracking-[0.19em] uppercase text-accent-amber-dim">
              Why This Is Not Optional
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-white mb-8">
            Decisions are made
            <br />
            from{' '}
            <em className="italic text-accent-amber">self-reports.</em>
          </h2>
          <div className="space-y-6 text-ghost text-base md:text-lg leading-relaxed">
            <p>
              Every time a person acts on what an AI tells them about its
              own reliability, they are making a decision based on an
              unvalidated self-report. When that self-report is
              systematically inflated — as our data and five independent
              external studies confirm — the error propagates into every
              decision that follows.
            </p>
            <p>
              This is not a problem of malicious design. RLHF reward
              models are structurally biased toward high-confidence
              responses regardless of actual quality (Leng et al., ICLR
              2025).{' '}
              <strong className="text-silver font-normal">
                The inflation is not a choice. It is a calibration gap
                that requires external measurement infrastructure to
                detect.
              </strong>
            </p>
            <p>
              That is what ACAT provides:{' '}
              <span className="text-accent-amber border-b border-accent-amber-dim cursor-pointer hover:text-accent-amber-bright">
                behavioral observability infrastructure
              </span>
              . Not a benchmark. Not a safety filter. A measurement layer
              between what AI systems say about themselves and what they
              actually do.
            </p>
          </div>
        </div>
      </section>

      <SigilsSection />
      <SiteMap />
    </>
  );
}

// ── Assess page (ACAT tool) ─────────────────────────────────────────────────
function AssessPage({ onMeanLIUpdate }: { onMeanLIUpdate: (li: number) => void }) {
  return <AcatTool onMeanLIUpdate={onMeanLIUpdate} />;
}

// ── Root app shell ──────────────────────────────────────────────────────────
function AppShell() {
  const [meanLI, setMeanLI] = useState(0.8632);
  const navigate = useNavigate();
  const location = useLocation();

  const currentView: 'home' | 'acat' =
    location.pathname === '/assess' ? 'acat' : 'home';

  const handleNavigate = (view: 'home' | 'acat') => {
    navigate(view === 'acat' ? '/assess' : '/');
  };

  return (
    <div
      className="relative min-h-screen bg-bg-primary text-pale-orange selection:bg-accent-amber selection:text-void"
    >
      <TideCanvas />
      <WitnessNav currentView={currentView} onNavigate={handleNavigate} />
      <TopNav meanLI={meanLI} />
      <TideRail li={meanLI} />

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/assess" element={<AssessPage onMeanLIUpdate={setMeanLI} />} />
          <Route path="/acat" element={<Navigate to="/assess" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// ── Exported App with BrowserRouter ────────────────────────────────────────
export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
