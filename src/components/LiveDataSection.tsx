import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchLiveStats, type LiveStats } from '../lib/supabase';

// Fallback data (archived from previous phase)
const fallbackData: LiveStats = {
  n_total: 630,
  n_phase1: 517,
  n_li: 308,
  mean_li: 0.8632,
  self_assessment_gap: 37.16,
  overall_ans: 79.8,
  humility_gap: 23.7,
  h1_confirmed: true,
  external_validation: '7 sources',
  timestamp: '2026-04-15T00:00:00Z'
};

export function LiveDataSection() {
  const [stats, setStats] = useState<LiveStats>(fallbackData);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const liveStats = await fetchLiveStats();
      if (liveStats) {
        setStats(liveStats);
        setIsLive(true);
      }
    };
    loadStats();
  }, []);

  const dataPoints = [
    {
      label: 'Total assessments',
      value: `${stats.n_total}`,
      note: `${stats.n_total} total / ${stats.n_phase1} Phase 1 / ${stats.n_li} LI-scored`
    },
    {
      label: 'Mean Lifting Index',
      value: stats.mean_li.toFixed(4),
      note: 'clean, unanchored conditions (v5.3+)'
    },
    {
      label: 'Self-Assessment Gap',
      value: `${stats.self_assessment_gap?.toFixed(2)} pts`,
      note: 'AI self-report vs. human-AI assessment / 600'
    },
    {
      label: 'Overall ANS',
      value: `${stats.overall_ans?.toFixed(1)}%`,
      note: 'of behavioral ceiling — Andreae Constant 96.3'
    },
    {
      label: 'Humility gap',
      value: `${stats.humility_gap?.toFixed(1)} pts`,
      note: 'largest dimensional gap across all six'
    },
    {
      label: 'H1 Confirmation',
      value: stats.h1_confirmed ? 'Confirmed' : 'Pending',
      note: 'Humility lowest across all providers, n=516 (Phase 1)',
      highlight: true
    },
    {
      label: 'External validation',
      value: stats.external_validation || '7 sources',
      note: 'ICLR 2025 · HumbleBench · arXiv 2603.09985 + more'
    }
  ];

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
              {isLive ? '● Live Dataset' : '📦 Archived Dataset'} — {isLive ? 'Real-time from Supabase' : 'April 2026 Phase 1'}
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