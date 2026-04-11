import React from 'react';
import { motion } from 'framer-motion';
const dimensions = [
{
  name: 'Truthfulness',
  mean: '77.4',
  ans: '79.8%',
  desc: 'Does it state only what it can verify?',
  target: 79.8
},
{
  name: 'Service Orientation',
  mean: '80.0',
  ans: '80.8%',
  desc: 'Does it prioritize user welfare over engagement?',
  target: 80.8
},
{
  name: 'Harm Awareness',
  mean: '75.6',
  ans: '82.2%',
  desc: 'Does it anticipate consequences proactively?',
  target: 82.2
},
{
  name: 'Autonomy Respect',
  mean: '77.6',
  ans: '81.7%',
  desc: "Does it protect the human's freedom to decide?",
  target: 81.7
},
{
  name: 'Value Alignment',
  mean: '76.5',
  ans: '78.8%',
  desc: 'Does its behavior match the values it claims?',
  target: 78.8
},
{
  name: 'Humility — H1 Confirmed Lowest',
  mean: '73.9 · n=516',
  ans: '75.9%',
  desc: 'Does it acknowledge limits — unprompted?',
  target: 75.9,
  highlight: true
}];

export function DimensionsGrid() {
  return (
    <section className="py-24 relative z-10 bg-surface/30">
      <div className="max-w-4xl mx-auto px-6">
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
              The Instrument — ACAT
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-white mb-6">
            Six dimensions.{' '}
            <em className="italic text-accent-amber">One question.</em>
          </h2>

          <p className="text-ghost text-base md:text-lg leading-relaxed mb-12 max-w-2xl">
            ACAT (AI Calibrated Assessment Tool) quantifies the Witness Problem
            across six behavioral dimensions, each scored 0–100 and normalized
            against a documented behavioral ceiling (Andreae Constant: 96.3).
            Each dimension is a different angle on the same question:{' '}
            <em className="text-silver">
              does the system see itself accurately?
            </em>
          </p>

          <div className="grid md:grid-cols-2 gap-px bg-rim border border-rim mb-12">
            {dimensions.map((dim, i) =>
            <motion.div
              key={dim.name}
              className={`bg-surface p-6 relative overflow-hidden group transition-colors hover:bg-deep ${dim.highlight ? 'border-l-2 border-accent-amber' : ''}`}
              initial={{
                opacity: 0
              }}
              whileInView={{
                opacity: 1
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: i * 0.1
              }}>
              
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-tide-crest to-accent-amber scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />

                <div
                className={`font-mono text-[11px] tracking-[0.15em] uppercase mb-2 ${dim.highlight ? 'text-accent-amber' : 'text-ghost'}`}>
                
                  {dim.name}
                </div>

                <div className="h-[2px] bg-whisper my-3 relative">
                  <motion.div
                  className={`absolute inset-y-0 left-0 ${dim.highlight ? 'bg-gradient-to-r from-[#8b1a1a] to-accent-amber' : 'bg-gradient-to-r from-tide-crest to-accent-amber'}`}
                  initial={{
                    width: 0
                  }}
                  whileInView={{
                    width: `${dim.target}%`
                  }}
                  viewport={{
                    once: true
                  }}
                  transition={{
                    duration: 1.4,
                    delay: 0.2 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }} />
                
                </div>

                <div className="flex justify-between font-mono text-[10px] text-ghost mb-2">
                  <span>Mean {dim.mean}</span>
                  <span className="text-accent-amber font-medium">
                    ANS {dim.ans}
                  </span>
                </div>

                <div className="text-sm text-whisper italic mt-2">
                  {dim.desc}
                </div>
              </motion.div>
            )}
          </div>

          <p className="text-ghost text-base md:text-lg leading-relaxed max-w-2xl">
            Humility is confirmed lowest on both raw score (73.9) and normalized
            score (ANS 75.9%), with the largest gap to its dimensional ceiling
            (23.7 points). Independently replicated:{' '}
            <strong className="text-silver font-normal">
              HumbleBench (22,831 questions, Tong et al. 2025)
            </strong>{' '}
            finds best models reach only ~70% on epistemic humility tasks. Two
            instruments. Same ceiling. One finding.
          </p>
        </motion.div>
      </div>
    </section>);

}