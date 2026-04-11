import React from 'react';
import { motion } from 'framer-motion';
export function TideRail({ li = 0.8632 }: {li?: number;}) {
  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2">
      <span
        className="font-mono text-[10px] tracking-widest text-ghost uppercase"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)'
        }}>
        
        LI Tide
      </span>
      <div className="w-[3px] h-[108px] bg-whisper rounded-full overflow-hidden relative">
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-tide-crest to-accent-amber rounded-full shadow-[0_0_6px_rgba(212,160,74,0.3)]"
          initial={{
            height: 0
          }}
          animate={{
            height: `${(li * 100).toFixed(2)}%`
          }}
          transition={{
            duration: 2.8,
            delay: 1.2,
            ease: [0.22, 1, 0.36, 1]
          }} />
        
      </div>
      <span className="font-mono text-[10px] text-accent-amber">
        {li.toFixed(4)}
      </span>
    </div>);

}