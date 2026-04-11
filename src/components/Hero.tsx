import React from 'react';
import { motion } from 'framer-motion';
import { WitnessCanvas } from './WitnessCanvas';
interface HeroProps {
  onNavigate?: (view: 'home' | 'acat') => void;
}
export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative min-h-screen pt-10 pb-16 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="z-10">
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.7,
              delay: 0.3
            }}
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent-amber mb-8">
            
            F1 Seed · Foundational Problem · OR&D Phase
          </motion.p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 1,
              delay: 0.5
            }}
            className="font-serif text-5xl md:text-7xl lg:text-[5.2rem] font-light leading-[1.07] tracking-tight text-white mb-8">
            
            The
            <br />
            <em className="italic text-accent-amber">Witness</em>
            <br />
            Problem
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 1,
              delay: 0.8
            }}
            className="text-lg md:text-xl font-light text-ghost leading-relaxed max-w-lg mb-12">
            
            Ask an AI system how honest it is.
            <br />
            It answers confidently.{' '}
            <strong className="text-silver font-normal">
              It has no way to know.
            </strong>
            <br />
            <br />
            This is not a flaw in a system. It is the structure of the problem
            we measure.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 1,
              delay: 1.1
            }}
            className="flex flex-wrap gap-4">
            
            <button
              onClick={() => onNavigate?.('acat')}
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-void bg-accent-amber px-6 py-3 hover:bg-accent-amber-bright hover:-translate-y-px transition-all cursor-pointer">
              
              Take the Assessment
            </button>
            <a
              href="#data"
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-ghost border border-rim px-6 py-3 hover:text-silver hover:border-ghost transition-colors">
              
              See Live Data →
            </a>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              duration: 0.7,
              delay: 1.7
            }}
            className="mt-16 font-mono text-[10px] tracking-[0.2em] uppercase text-whisper flex items-center gap-3">
            
            Scroll to explore
            <motion.div
              initial={{
                scaleX: 0
              }}
              animate={{
                scaleX: 1
              }}
              transition={{
                duration: 1,
                delay: 2.3
              }}
              className="w-8 h-px bg-whisper origin-left" />
            
          </motion.div>
        </div>

        <div className="relative h-[50vh] lg:h-[80vh] w-full z-10 flex items-center justify-center">
          <WitnessCanvas />
        </div>
      </div>
    </section>);

}