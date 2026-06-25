import React from 'react';
import { motion } from 'framer-motion';
const mapItems = [
{
  layer: 'F1 · Now · You are here',
  title: 'Witness',
  note: 'The problem. The foundation. Everything traces here.',
  active: true
},
{
  layer: 'F1 · Live',
  title: 'Observatory',
  note: 'Live data. The tide moves when ACAT moves.'
},
{
  layer: 'F2',
  title: 'ACAT Instrument',
  note: 'Take the assessment. See your calibration gap.'
},
{
  layer: 'F3',
  title: 'Methodology',
  note: 'Three-phase protocol. Research design. Bibliography.'
},
{
  layer: 'F5',
  title: 'Hypothesis Registry',
  note: '48 active hypotheses. Live status tracking.'
},
{
  layer: 'F8 · Gate 3',
  title: 'Enterprise Infrastructure',
  note: 'Calibration at deployment scale. API. Revenue.'
}];

export function SiteMap() {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true,
            margin: '-100px'
          }}
          transition={{
            duration: 0.8
          }}>
          
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-accent-amber-dim" />
            <span className="font-mono text-[11px] tracking-[0.19em] uppercase text-accent-amber-dim">
              The Fibonacci Structure — Site Map
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-white mb-6">
            One seed.
            <br />
            <em className="italic text-accent-amber">Every layer</em> its sum.
          </h2>

          <p className="text-ghost text-base md:text-lg leading-relaxed mb-10">
            This page is the F1 seed. Every page that follows is built from what
            came before it. Each is verified before the next is planted.
          </p>

          <div className="border-l border-rim pl-8 py-4 space-y-6">
            {mapItems.map((item, i) =>
            <div key={item.title} className="relative py-2">
                <div className="absolute -left-8 top-6 w-5 h-px bg-rim" />
                <div
                className={`absolute -left-[35px] top-5 w-[7px] h-[7px] rounded-full border ${item.active ? 'bg-accent-amber border-accent-amber shadow-[0_0_8px_var(--accent-amber-dim)]' : 'bg-void border-rim'}`} />
              

                <div
                className={`font-mono text-[10px] tracking-[0.14em] uppercase mb-1 ${item.active ? 'text-accent-amber' : 'text-whisper'}`}>
                
                  {item.layer}
                </div>
                <div
                className={`font-serif text-lg ${item.active ? 'text-white' : 'text-ghost hover:text-accent-amber transition-colors cursor-pointer'}`}>
                
                  {item.title}
                </div>
                <div className="text-sm text-whisper italic mt-1">
                  {item.note}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>);

}