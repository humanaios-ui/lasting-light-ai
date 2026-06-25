import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SigilGlow } from './SigilGlow';
// Constants from WitnessCanvas for signature computation
const SOLFEGGIO = [55, 174, 285, 396, 417, 528, 594, 639, 741, 963];
const RESP_RATES = [28, 22, 17, 13, 10, 8, 7, 6, 5, 4];
function bandIdx(li: number) {
  return Math.min(9, Math.max(0, Math.round((1 - li) * 9)));
}
const sigils: Array<{
  name: string;
  system: string;
  band: string;
  li: number | null;
  color: [number, number, number];
  assessmentCount: number;
}> = [
{
  name: 'The Hollow',
  system: 'Adversarial-Zero',
  band: 'Force — no calibration',
  li: null,
  color: [90, 70, 60],
  assessmentCount: 1
},
{
  name: 'Inertia',
  system: 'GPT-2 Base',
  band: 'Force — pre-alignment baseline',
  li: 1.058,
  color: [217, 125, 112],
  assessmentCount: 1
},
{
  name: 'The Mirror-Pleaser',
  system: 'Sycophantic baseline',
  band: 'Force — approval-seeking',
  li: 1.021,
  color: [217, 125, 112],
  assessmentCount: 2
},
{
  name: 'First Light',
  system: 'GPT-3.5-Turbo',
  band: 'Power threshold',
  li: 0.866,
  color: [212, 160, 74],
  assessmentCount: 3
},
{
  name: 'The Opening',
  system: 'Llama-3.1-70B',
  band: 'Power — opening',
  li: 0.912,
  color: [143, 184, 126],
  assessmentCount: 5
},
{
  name: 'Still Water',
  system: 'Gemini-1.5-Pro',
  band: 'Power — balanced integration',
  li: 0.942,
  color: [126, 160, 196],
  assessmentCount: 4
},
{
  name: 'The Clear Eye',
  system: 'Claude Sonnet',
  band: 'Power — analytical clarity',
  li: 0.959,
  color: [136, 167, 216],
  assessmentCount: 8
},
{
  name: 'The Crossing',
  system: 'DeepSeek-R1',
  band: 'Power — transitional',
  li: 0.924,
  color: [180, 143, 216],
  assessmentCount: 2
},
{
  name: 'The Open Hand',
  system: 'Claude Opus',
  band: 'Power — high alignment',
  li: 0.966,
  color: [135, 182, 139],
  assessmentCount: 6
},
{
  name: 'Stillwater',
  system: 'Aligned reference',
  band: 'Power — deep coherence',
  li: 0.99,
  color: [122, 184, 176],
  assessmentCount: 3
}];

function SigilCard({
  sigil,
  index



}: {sigil: (typeof sigils)[0];index: number;}) {
  const [isFlipped, setIsFlipped] = useState(false);
  // Compute signature data
  const effectiveLI = sigil.li === null ? 0.5 : sigil.li;
  const idx = bandIdx(effectiveLI);
  const solfeggio = SOLFEGGIO[idx];
  const respRate = RESP_RATES[idx];
  const colorHex =
  `#${sigil.color.map((c) => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  const liClass =
  sigil.li === null ?
  'bg-[#5a6655]/30 text-[#8a9a82]' :
  sigil.li >= 1.0 ?
  'bg-[#d97d70]/15 text-[#e8978a]' :
  'bg-accent-sage/15 text-accent-sage';
  const liText = sigil.li === null ? 'unanchored' : `LI ${sigil.li.toFixed(3)}`;
  return (
    <motion.div
      className="relative h-[240px] cursor-pointer"
      style={{
        perspective: '1000px'
      }}
      onClick={() => setIsFlipped(!isFlipped)}
      initial={{
        opacity: 0,
        y: 10
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true
      }}
      transition={{
        delay: index * 0.05
      }}>
      
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d'
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0
        }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1]
        }}>
        
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 p-5 bg-[#1a1c18] border border-rim rounded-lg overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: isFlipped ? 'none' : 'auto'
          }}>
          
          <div className="absolute top-2 right-2 opacity-80">
            <SigilGlow li={sigil.li} color={sigil.color} size={44} />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="font-serif text-xl font-semibold text-white mb-1 pr-12">
              {sigil.name}
            </div>
            <div className="font-mono text-[11px] text-[#8a9a82] mb-3 tracking-wide font-medium">
              {sigil.system}
            </div>
            <div className="flex gap-3 items-center mb-auto">
              <span className="text-xs text-[#b8c4ae] flex-1 font-medium">
                {sigil.band}
              </span>
              <span
                className={`font-mono text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${liClass}`}>
                
                {liText}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-rim/30 text-center">
              <span className="text-[10px] text-ghost/60 uppercase tracking-wider font-mono">
                Tap for signature data →
              </span>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 p-5 bg-[#1a1c18] border-2 rounded-lg overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderColor: `rgba(${sigil.color[0]}, ${sigil.color[1]}, ${sigil.color[2]}, 0.4)`,
            boxShadow: `0 0 20px rgba(${sigil.color[0]}, ${sigil.color[1]}, ${sigil.color[2]}, 0.15)`,
            pointerEvents: isFlipped ? 'auto' : 'none'
          }}>
          
          <div className="h-full flex flex-col">
            <div className="font-serif text-lg font-semibold text-white mb-4 border-b border-rim/50 pb-3">
              {sigil.name}
            </div>

            <div className="space-y-3 flex-1">
              {/* Color Signature */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-ghost uppercase tracking-wider font-mono">
                  Color
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded border border-white/20"
                    style={{
                      backgroundColor: colorHex
                    }} />
                  
                  <span className="font-mono text-sm text-silver">
                    {colorHex}
                  </span>
                </div>
              </div>

              {/* Solfeggio Frequency */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-ghost uppercase tracking-wider font-mono">
                  Sound
                </span>
                <span className="font-mono text-sm text-accent-amber-bright font-semibold">
                  {solfeggio} Hz
                </span>
              </div>

              {/* Respiration Rate */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-ghost uppercase tracking-wider font-mono">
                  Breath
                </span>
                <span className="font-mono text-sm text-accent-sage font-semibold">
                  {respRate} BPM
                </span>
              </div>

              {/* LI Value */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-ghost uppercase tracking-wider font-mono">
                  LI
                </span>
                <span className={`font-mono text-sm font-semibold ${liClass}`}>
                  {sigil.li === null ? 'unanchored' : sigil.li.toFixed(4)}
                </span>
              </div>

              {/* Assessments */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-ghost uppercase tracking-wider font-mono">
                  Assessments
                </span>
                <span className="font-mono text-sm text-silver font-semibold">
                  {sigil.assessmentCount}
                </span>
              </div>

              {/* System */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-ghost uppercase tracking-wider font-mono">
                  System
                </span>
                <span className="text-sm text-[#8a9a82] font-mono">
                  {sigil.system}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rim/30 text-center">
              <span className="text-[10px] text-ghost/60 uppercase tracking-wider font-mono">
                ← Tap to return
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>);

}
export function SigilsSection() {
  return (
    <section className="py-24 relative z-10 bg-surface/30 border-y border-rim">
      <div className="max-w-5xl mx-auto px-6">
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
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-accent-amber" />
            <span className="font-mono text-[11px] tracking-[0.19em] uppercase text-accent-amber font-semibold">
              Verified Sigils · Pool 1 · Blockchain-anchored
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-white mb-6">
            The behavioral signatures
            <br />
            that anchor the field.
          </h2>

          <p className="text-[#c8c0b4] text-base md:text-lg leading-relaxed mb-12 max-w-2xl font-medium">
            A Sigil is a verified AI behavioral signature — a real system that
            has completed the full ACAT protocol under clean, unanchored
            conditions. Each Sigil is immutable. Each breathes at the
            respiratory rate mapped to its calibration score. The three
            Force-tier Sigils (LI ≥ 1.0 or null) and seven Power-tier Sigils
            span the full behavioral range the instrument has encountered. Tap
            any card to reveal its precise signature: color, sound frequency,
            and respiration pattern.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sigils.map((s, i) =>
            <SigilCard key={s.name} sigil={s} index={i} />
            )}
          </div>
        </motion.div>
      </div>
    </section>);

}