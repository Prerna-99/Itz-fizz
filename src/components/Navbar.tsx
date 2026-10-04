import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface NavbarProps {
  onOpenReserve: () => void;
  reserveCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenReserve, reserveCount }) => {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const handleToggleAudio = () => {
    const active = audioEngine.toggleMute();
    setIsAudioActive(active);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[#07080c]/80 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a 
          href="#" 
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
        >
          <span className="font-['Syne'] font-bold text-xl tracking-[0.25em] text-white group-hover:text-amber-300 transition-colors uppercase">
            ITZ FIZZ
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
        </a>

        {/* Zone 2: 4 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.16em] font-medium text-neutral-400">
          <a href="#effervescence" className="hover:text-white transition-colors duration-200">
            Effervescence
          </a>
          <a href="#formulations" className="hover:text-white transition-colors duration-200">
            Formulations
          </a>
          <a href="#sensory-lab" className="hover:text-white transition-colors duration-200">
            Sensory Lab
          </a>
          <a href="#ritual" className="hover:text-white transition-colors duration-200">
            The Ritual
          </a>
        </nav>

        {/* Zone 3: Functional actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleAudio}
            type="button"
            className="p-2.5 rounded-lg border border-white/10 text-neutral-300 hover:text-white hover:border-amber-400/40 hover:bg-white/[0.04] transition-all flex items-center gap-2 text-xs font-mono"
            title={isAudioActive ? 'Mute fizz acoustics' : 'Enable sensory fizz audio'}
            aria-label={isAudioActive ? 'Mute fizz acoustics' : 'Enable sensory fizz audio'}
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline text-[11px] text-amber-300">Fizz Active</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-neutral-400" />
                <span className="hidden sm:inline text-[11px] text-neutral-400">Fizz Audio</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenReserve}
            type="button"
            className="relative px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase rounded-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_28px_rgba(245,158,11,0.4)] whitespace-nowrap active:scale-95"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Reserve Tasting</span>
              {reserveCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-black text-amber-300 text-[10px] font-mono rounded">
                  {reserveCount}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
