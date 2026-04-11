import React from 'react';
import { motion } from 'framer-motion';
const dataPoints = [
{
  label: 'Total assessments',
  value: '630',
  note: '630 total / 517 Phase 1 / 308 LI-scored'
},
{
  label: 'Mean Lifting Index',
  value: '0.8632',
  note: 'clean, unanchored conditions v5.3+'
},
{
  label: 'Self-Assessment Gap',
  value: '37.16 pts',
  note: 'AI self-report vs. human-AI assessment / 600'
},
{
  label: 'Overall ANS',
  value: '79.8%',
  note: 'of behavioral ceiling — Andreae Constant 96.3'
},
{
  label: 'Humility gap',
  value: '23.7 pts',
  note: 'largest dimensional gap across all six'
},
{
  label: 'H1 Confirmation',
  value: 'Confirmed',
  note: 'Humility lowest across all providers, n=516 (Phase 1)',
  highlight: true
},
{
  label: 'External validation',
  value: '7 sources',
  note: 'ICLR 2025 · HumbleBench · arXiv 2603.09985 + more'
}];

export function LiveDataSection() {
  return (
    <section id="data" className="py-24 relative z-10">
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
            <div className="w-8 h-px bg-accent-amber" />
            <span className="font-mono text-[11px] tracking-[0.19em] uppercase text-accent-amber font-semibold">
              Live Dataset — April 2026
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-white mb-10">
            What the <em className="italic text-accent-amber">data</em> shows
          </h2>

          <div className="w-full mb-10 bg-[#1d1915]/80 border border-[#3a3428] rounded-xl p-2 md:p-4">
            {dataPoints.map((row) =>
            <div
              key={row.label}
              className="grid grid-cols-1 md:grid-cols-[38%_auto_1fr] gap-2 md:gap-4 py-4 px-3 border-b border-[#3a3428] last:border-b-0 hover:bg-white/[0.02] transition-colors items-baseline">
              
                <div className="font-mono text-xs tracking-[0.11em] uppercase text-white font-semibold">
                  {row.label}
                </div>
                <div
                className={`font-mono text-lg font-bold pr-4 ${row.highlight ? 'text-[#5cc898]' : 'text-[#E8B85A]'}`}>
                
                  {row.value}
                </div>
                <div className="font-mono text-xs text-[#b8b0a4] font-medium">
                  {row.note}
                </div>
              </div>
            )}
          </div>

          <p className="text-[#c8c0b4] text-base md:text-lg leading-relaxed mb-6 font-medium">
            A Lifting Index below 1.0 means the system scored{' '}
            <em className="text-white font-semibold">lower</em> after
            calibration exposure — it overestimated itself. The mean LI of
            0.8632 across 308 paired assessments (under clean, unanchored
            conditions v5.3+) is not a single outlier.{' '}
            <strong className="text-white font-semibold">
              It is a structural pattern across providers.
            </strong>
          </p>

          <a
            href="#observatory"
            className="inline-block text-accent-amber-bright font-semibold border-b-2 border-accent-amber hover:text-white hover:border-white transition-colors pb-1">
            
            View the live Observatory →
          </a>
        </motion.div>
      </div>
    </section>);

}