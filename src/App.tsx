import React, { useState } from 'react';
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
export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'acat'>('home');
  const [meanLI, setMeanLI] = useState(0.8632);
  return (
    <div className="relative min-h-screen bg-bg-primary text-pale-orange selection:bg-accent-amber selection:text-void">
      {/* Background Animation */}
      <TideCanvas />

      {/* Fixed UI Elements */}
      <WitnessNav currentView={currentView} onNavigate={setCurrentView} />
      <TideRail li={meanLI} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {currentView === 'home' ?
        <>
            <Hero onNavigate={setCurrentView} />
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
                    actually do. So that the humans and organizations who depend
                    on them can make decisions based on truth.
                  </p>
                </div>
              </div>
            </section>

            <SigilsSection />
            <SiteMap />
          </> :

        <AcatTool onMeanLIUpdate={setMeanLI} />
        }
      </main>

      <Footer />
    </div>);

}