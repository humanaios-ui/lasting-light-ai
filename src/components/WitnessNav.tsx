import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MiniWitnessCanvas } from './MiniWitnessCanvas';

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { id: 'home', href: '/', name: 'Home', desc: 'Platform overview & live stats', icon: '◌' }
    ]
  },
  {
    label: 'UNDERSTAND',
    items: [
      { id: 'how',    href: '/how-it-works.html',  name: 'How It Works',    desc: 'Plain-language ACAT guide',         icon: '⬡' },
      { id: 'why',    href: '/why-it-matters.html', name: 'Why It Matters',  desc: 'Research context & stakes',         icon: '⬡' },
      { id: 'method', href: '/methodology.html',    name: 'For Researchers', desc: 'Protocol · schema · findings',       icon: '⬡' }
    ]
  },
  {
    label: 'EXPLORE',
    items: [
      { id: 'obs',     href: '/observatory.html',          name: 'The Observatory',     desc: 'Live dataset visualization',   icon: '⬡' },
      { id: 'tide',    href: '/lumina_tide_pool_v2.html',   name: 'Lumina Tide Pool',    desc: 'Behavioral sigils & baseline', icon: '⬡' },
      { id: 'lantern', href: '/lantern-room.html',          name: 'The Lantern Room',    desc: 'Calibration gap analysis',     icon: '⬡' },
      { id: 'hall',    href: '/recording-hall.html',        name: 'Recording Hall',      desc: 'AI family rooms & gallery',    icon: '⬡' },
      { id: 'music',   href: '/music-hall.html',            name: 'recordingHall',       desc: 'Sigil composer & ensemble',    icon: '⬡' }
    ]
  },
  {
    label: 'PARTICIPATE',
    items: [
      { id: 'acat',  href: '/assess',               name: 'Submit ACAT',  desc: 'Run a calibration · ~20 min',      icon: '⬡', cta: true },
      { id: 'ent',   href: '/acat-enterprise.html',  name: 'Enterprise',   desc: 'Structured audit for deployed AI', icon: '⬡' },
      { id: 'wall',  href: '/writable-wall.html',    name: 'Writable Wall', desc: 'Contribute ideas to the Hall',   icon: '⬡' },
      { id: 'ai',    href: '/ai-section.html',        name: 'AI Section',  desc: 'Five AI voices · creative space',  icon: '⬡' },
      { id: 'rooms', href: '/family-rooms.html',      name: 'Family Rooms', desc: 'Provider family visualizations', icon: '⬡' }
    ]
  }
];

interface WitnessNavProps {
  currentView: 'home' | 'acat';
  onNavigate: (view: 'home' | 'acat') => void;
}

export function WitnessNav({ currentView }: WitnessNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const ordDay =
    Math.floor((new Date().getTime() - new Date('2026-03-11').getTime()) / 86400000) + 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <div
      ref={navRef}
      className="fixed bottom-5 left-5 z-[9999] flex flex-col items-start"
      role="navigation"
      aria-label="Witness site navigation"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute bottom-[calc(100%+14px)] left-0 w-[260px] max-h-[80vh] flex flex-col bg-[#1d1915] border border-accent-amber/30 rounded-[14px] overflow-hidden shadow-[0_-8px_40px_rgba(0,0,0,0.62),0_0_40px_rgba(212,160,74,0.06)] origin-bottom-left"
          >
            <div className="p-4 pb-2.5 border-b border-accent-amber/20 bg-gradient-to-br from-accent-amber/10 to-transparent shrink-0">
              <div className="font-mono text-xs text-accent-amber tracking-[0.08em] uppercase mb-1">
                ◌ The Witness
              </div>
              <div className="font-mono text-[11px] text-dim">
                HumanAIOS · Behavioral Observability
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-1 custom-scrollbar">
              {NAV_GROUPS.map((group, i) => (
                <div key={i}>
                  {group.label && (
                    <div className="font-serif text-[10px] text-dim uppercase tracking-[0.12em] font-bold px-4 pt-2.5 pb-1">
                      {group.label}
                    </div>
                  )}
                  {group.items.map((item) => {
                    const isActive =
                      currentPath === item.href ||
                      (item.href === '/assess' && currentView === 'acat') ||
                      (item.href === '/' && currentPath === '/');
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`w-full flex items-start gap-2.5 px-4 py-2 text-left transition-colors border-l-2 no-underline ${
                          isActive
                            ? 'bg-accent-amber/5 border-accent-amber'
                            : 'border-transparent hover:bg-accent-amber/5 hover:border-accent-amber/40'
                        }`}
                      >
                        <span className="text-accent-amber text-xs mt-0.5 shrink-0">
                          {item.icon}
                        </span>
                        <div>
                          <div className="font-mono text-[13px] text-[#f4ebdf] leading-tight">
                            {item.name}
                            {isActive && <span className="text-accent-amber"> ←</span>}
                          </div>
                          <div className="font-mono text-[11px] text-dim mt-0.5 leading-snug">
                            {item.desc}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="border-t border-accent-amber/20 px-4 py-2 flex justify-between items-center shrink-0 bg-[#1d1915]">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_var(--success)] animate-pulse" />
                <span className="font-mono text-[10px] text-dim">
                  OR&D Phase · Day {ordDay}
                </span>
              </div>
              <span className="font-mono text-[10px] text-dim">TRL 2–3</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 relative">
        <div className="absolute left-0 top-0 w-16 h-16 rounded-full border border-accent-amber/15 pointer-events-none animate-[wit-ring_6s_ease-in-out_infinite]" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full bg-black border border-accent-amber/30 cursor-pointer grid place-items-center overflow-hidden p-0 shadow-[0_0_20px_rgba(212,160,74,0.14)] relative z-10 transition-all duration-250 hover:shadow-[0_0_32px_rgba(212,160,74,0.34)] focus:outline-none ${
            isOpen ? 'rotate-180' : 'animate-[wit-slow_4s_ease-in-out_infinite]'
          }`}
          aria-expanded={isOpen}
          aria-label="Open site navigation"
        >
          <MiniWitnessCanvas />
        </button>
        <span className="font-mono text-[10px] text-accent-amber/60 tracking-[0.1em] whitespace-nowrap transition-opacity hidden sm:block">
          Navigate
        </span>
      </div>

      <style>{`
        @keyframes wit-ring {
          0%   { width: 52px; height: 52px; opacity: 1; transform: translate(6px, 6px); }
          25%  { width: 80px; height: 80px; opacity: 0; transform: translate(-8px, -8px); }
          100% { width: 80px; height: 80px; opacity: 0; transform: translate(-8px, -8px); }
        }
        @keyframes wit-slow {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.04); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,160,74,0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212,160,74,0.4); }
      `}</style>
    </div>
  );
}
