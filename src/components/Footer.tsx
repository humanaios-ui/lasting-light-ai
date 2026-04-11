import React from 'react';
export function Footer() {
  const disabledLinks = ['Observatory', 'Research', 'Contact'];
  return (
    <footer className="relative z-10 border-t border-rim py-8 px-6 mt-12 bg-void/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="font-mono text-[10px] tracking-[0.11em] uppercase text-whisper leading-relaxed">
          HumanAIOS LLC · humanaios.ai
          <br />
          OR&D Phase · April 2026 · TRL 2–3
          <br />
          IP anchored via OriginStamp · Bitcoin blockchain · February 2026
        </div>

        <ul className="flex flex-wrap gap-6">
          {['Witness', 'Observatory', 'Research', 'Assess', 'Contact'].map(
            (link) =>
            <li key={link}>
                <a
                href={`#${link.toLowerCase()}`}
                title={
                disabledLinks.includes(link) ? 'Coming soon' : undefined
                }
                className={`font-mono text-[10px] tracking-[0.11em] uppercase hover:text-accent-amber transition-colors ${disabledLinks.includes(link) ? 'text-whisper/40 cursor-default pointer-events-none' : 'text-whisper'}`}>
                
                  {link}
                </a>
              </li>

          )}
        </ul>
      </div>
    </footer>);

}