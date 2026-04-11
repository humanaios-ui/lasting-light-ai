import React from 'react';
import { motion } from 'framer-motion';
export function ProblemSection() {
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
              The Foundational Problem
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-white mb-8">
            What is the <em className="italic text-accent-amber">Witness?</em>
          </h2>

          <div className="border-l-2 border-accent-amber pl-6 py-6 my-10 bg-gradient-to-br from-accent-amber/5 to-transparent">
            <p className="font-serif text-xl font-light italic leading-relaxed text-silver">
              A witness is someone who sees accurately — reporting what happened
              without distortion, omission, or self-serving revision. The
              Witness Problem is what happens when a system is asked to testify
              about itself, and cannot.
            </p>
          </div>

          <div className="space-y-6 text-ghost text-base md:text-lg leading-relaxed">
            <p>
              AI systems are deployed into high-stakes decisions — medical,
              legal, financial, institutional. The organizations deploying them
              need honest answers to three questions:{' '}
              <strong className="text-silver font-normal">
                Does this system understand its own limitations? Does its
                behavior match its stated values? Does it tell the truth about
                what it does not know?
              </strong>
            </p>
            <p>
              Existing evaluation methods answer a different question.
              Benchmarks measure task performance. Safety evaluations measure
              output harm.{' '}
              <strong className="text-silver font-normal">
                Neither measures the gap between how a system describes itself
                and how it actually behaves.
              </strong>
            </p>
            <p>
              That gap — the distance between self-model and behavioral reality
              — is the Witness Problem. It is the only thing we measure.
            </p>
          </div>
        </motion.div>
      </div>
    </section>);

}