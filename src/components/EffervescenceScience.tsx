import React, { useState, useEffect, useRef } from 'react';
import { Gauge, Activity, Waves, Sparkles, Wind } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface PressureMode {
  id: string;
  name: string;
  bar: number;
  psi: number;
  micronSize: number;
  description: string;
  sensoryProfile: string;
  speedMultiplier: number;
  bubbleCount: number;
}

const PRESSURE_MODES: PressureMode[] = [
  {
    id: 'silken',
    name: 'Silken Drift',
    bar: 1.8,
    psi: 26.1,
    micronSize: 22,
    description: 'Ultra-delicate velvet bead. Designed for subtle florals and delicate tea infusions.',
    sensoryProfile: 'Soft tactile mouthfeel, gentle whisper on the palate.',
    speedMultiplier: 0.6,
    bubbleCount: 30
  },
  {
    id: 'signature',
    name: 'Signature Crisp',
    bar: 2.8,
    psi: 40.6,
    micronSize: 34,
    description: 'Our proprietary balance. Releases aromatic citrus oils while maintaining structural fizz.',
    sensoryProfile: 'Crisp snap, elevated olfactory diffusion, refreshing finish.',
    speedMultiplier: 1.0,
    bubbleCount: 65
  },
  {
    id: 'razor',
    name: 'Razor Sparkle',
    bar: 3.8,
    psi: 55.1,
    micronSize: 48,
    description: 'High kinetic energy burst. Maximum palate cleanse paired with botanical bitters.',
    sensoryProfile: 'Electric tingle, intense crackle, dry mineral snap.',
    speedMultiplier: 1.7,
    bubbleCount: 110
  }
];

export const EffervescenceScience: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<PressureMode>(PRESSURE_MODES[1]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.clientWidth || 300);
    const height = (canvas.height = canvas.clientHeight || 400);

    interface LabBubble {
      x: number;
      y: number;
      size: number;
      speed: number;
      wobble: number;
      opacity: number;
    }

    const bubbles: LabBubble[] = [];
    for (let i = 0; i < selectedMode.bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: (selectedMode.micronSize / 15) * (0.6 + Math.random() * 0.8),
        speed: (0.8 + Math.random() * 1.6) * selectedMode.speedMultiplier,
        wobble: Math.random() * Math.PI * 2,
        opacity: 0.3 + Math.random() * 0.6
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Liquid background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(16, 20, 32, 0.4)');
      grad.addColorStop(1, 'rgba(8, 10, 16, 0.8)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      bubbles.forEach((b) => {
        b.y -= b.speed;
        b.wobble += 0.05;
        b.x += Math.sin(b.wobble) * 0.5;

        if (b.y < 0) {
          b.y = height;
          b.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${b.opacity * 0.7})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(b.x - b.size * 0.3, b.y - b.size * 0.3, b.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.9})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, [selectedMode]);

  const handleSelectMode = (mode: PressureMode) => {
    setSelectedMode(mode);
    audioEngine.playBubblePop();
  };

  return (
    <section id="effervescence" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="max-w-3xl mb-14">
        <div className="text-xs uppercase tracking-[0.2em] font-mono text-amber-400 mb-3 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" />
          <span>Biophysics of Carbonation</span>
        </div>
        <h2 className="font-['Syne'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase mb-4">
          The Science of Micro-Effervescence
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Standard sodas inject coarse 300-micron gas pockets that scorch taste receptors with caustic carbon acidity. ITZ FIZZ utilizes cryogenic micro-shear infusion to produce 34-micron micro-bubbles that gently transport aromatic botanical oils directly to olfactory receptors.
        </p>
      </div>

      {/* Interactive Carbonation Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive Pressure Selector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs uppercase font-mono tracking-wider text-neutral-400 mb-2">
            Select Carbonation Pressure Chamber:
          </div>

          <div className="space-y-3">
            {PRESSURE_MODES.map((mode) => {
              const isSelected = selectedMode.id === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => handleSelectMode(mode)}
                  type="button"
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                      : 'bg-[#10121a]/60 border-white/[0.08] hover:border-white/20 hover:bg-[#141724]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-['Syne'] font-semibold text-lg text-white">
                        {mode.name}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.06] text-amber-300">
                        {mode.bar} BAR · {mode.psi} PSI
                      </span>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">
                      Ø {mode.micronSize}µm Bead
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 mb-2">
                    {mode.description}
                  </p>
                  <div className="text-[11px] text-amber-400/90 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>{mode.sensoryProfile}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Comparative Specs (Clean Tabular Data) */}
          <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/[0.08]">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="block text-[10px] uppercase font-mono text-neutral-400">Bubble Diameter</span>
              <span className="font-mono text-base font-semibold text-white">~34 Microns</span>
              <span className="block text-[10px] text-neutral-400 mt-0.5">1/10th of craft soda</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="block text-[10px] uppercase font-mono text-neutral-400">Palate pH</span>
              <span className="font-mono text-base font-semibold text-white">6.2 Balanced</span>
              <span className="block text-[10px] text-neutral-400 mt-0.5">Enamel-safe mineral</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="block text-[10px] uppercase font-mono text-neutral-400">Temp Optimal</span>
              <span className="font-mono text-base font-semibold text-white">3.8°C – 4.2°C</span>
              <span className="block text-[10px] text-neutral-400 mt-0.5">Peak bead tension</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Responsive Fluid Canvas Vessel */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border border-amber-400/30 bg-[#0a0c14] shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            {/* Live micro-bubble simulator canvas */}
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Overlaid telemetry gauge HUD */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-neutral-300 pointer-events-none">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Gauge className="w-3.5 h-3.5" />
                <span>CHAMBER {selectedMode.bar} BAR</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px]">
                LIVE RENDER
              </span>
            </div>

            {/* Bottom chamber stat readout */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 pointer-events-none">
              <div className="flex justify-between items-center text-xs font-mono text-neutral-300 mb-1">
                <span>ACTIVE VELOCITY</span>
                <span className="text-amber-400 font-bold">{selectedMode.speedMultiplier}x NORMAL</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${(selectedMode.bar / 4.0) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <span className="mt-3 text-[11px] font-mono text-neutral-400">
            Real-time hydrodynamic particle simulation at {selectedMode.bar} Bar
          </span>
        </div>
      </div>
    </section>
  );
};
