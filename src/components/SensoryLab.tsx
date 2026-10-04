import React, { useState } from 'react';
import { Sliders, FlaskConical, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { audioEngine } from '../utils/audio';

export const SensoryLab: React.FC = () => {
  const [citrusIntensity, setCitrusIntensity] = useState(75);
  const [effervescencePressure, setEffervescencePressure] = useState(65);
  const [botanicalDepth, setBotanicalDepth] = useState(80);
  const [chillTemp, setChillTemp] = useState(4.0);

  const calculatePalateScore = () => {
    // Derived balance calculation
    const balance = (citrusIntensity * 0.35 + effervescencePressure * 0.4 + botanicalDepth * 0.25).toFixed(1);
    return balance;
  };

  const resetDials = () => {
    setCitrusIntensity(75);
    setEffervescencePressure(65);
    setBotanicalDepth(80);
    setChillTemp(4.0);
    audioEngine.playBubblePop();
  };

  return (
    <section id="sensory-lab" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto border-t border-white/[0.06]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-mono text-amber-400 mb-3 flex items-center gap-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Interactive Formulator</span>
          </div>
          <h2 className="font-['Syne'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
            Sensory Architecture Lab
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetDials}
            type="button"
            className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Sliders Console */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Biophysical Parameters
            </span>
            <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Real-Time Model</span>
            </span>
          </div>

          {/* Slider 1: Cold-Pressed Citrus Ratio */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-300">1. Cold-Pressed Yuzu/Citrus Extract</span>
              <span className="text-amber-400 font-bold">{citrusIntensity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={citrusIntensity}
              onChange={(e) => {
                setCitrusIntensity(Number(e.target.value));
                audioEngine.playBubblePop();
              }}
              className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>Subtle Floral (20%)</span>
              <span>Tart & Piercing (100%)</span>
            </div>
          </div>

          {/* Slider 2: Carbonation Head Pressure */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-300">2. Cryogenic Carbonation Pressure</span>
              <span className="text-amber-400 font-bold">{(1.5 + (effervescencePressure / 100) * 2.5).toFixed(2)} BAR</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={effervescencePressure}
              onChange={(e) => {
                setEffervescencePressure(Number(e.target.value));
                audioEngine.playBubblePop();
              }}
              className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>Velvet Bead (1.75 Bar)</span>
              <span>Ultra Crisp (4.00 Bar)</span>
            </div>
          </div>

          {/* Slider 3: Alpine Botanical Maceration */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-300">3. Wild Botanical Maceration Depth</span>
              <span className="text-amber-400 font-bold">{botanicalDepth} hrs @ 2°C</span>
            </div>
            <input
              type="range"
              min="24"
              max="120"
              value={botanicalDepth}
              onChange={(e) => {
                setBotanicalDepth(Number(e.target.value));
                audioEngine.playBubblePop();
              }}
              className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>Light Extraction (24h)</span>
              <span>Deep Tannic Bloom (120h)</span>
            </div>
          </div>

          {/* Slider 4: Serving Calibration Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-300">4. Serving Chamber Temperature</span>
              <span className="text-amber-400 font-bold">{chillTemp.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={chillTemp}
              onChange={(e) => {
                setChillTemp(Number(e.target.value));
                audioEngine.playBubblePop();
              }}
              className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>Sub-Zero Ice Matrix (1.0°C)</span>
              <span>Ambient Aromatic (10.0°C)</span>
            </div>
          </div>
        </div>

        {/* Real-time Output Readout Card */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-neutral-400 mb-2">
              Sensory Matrix Analysis
            </div>
            <div className="font-['Syne'] font-bold text-3xl sm:text-4xl text-white font-mono tabular-nums mb-4">
              {calculatePalateScore()}<span className="text-base text-amber-400 font-normal"> / 100 Sensory Index</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[11px] uppercase font-mono text-neutral-400 mb-1">
                  Olfactory Dispersion
                </div>
                <div className="text-xs text-neutral-200">
                  {citrusIntensity > 60
                    ? 'High volatility with bright top-note airborne projection.'
                    : 'Subtle, grounded herbaceous whisper.'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[11px] uppercase font-mono text-neutral-400 mb-1">
                  Micro-Bubble Dynamic
                </div>
                <div className="text-xs text-neutral-200">
                  {effervescencePressure > 50
                    ? 'Continuous effervescent bead curtain; tingling palate activation.'
                    : 'Gentle, wine-like effervescence.'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[11px] uppercase font-mono text-neutral-400 mb-1">
                  Optimal Food Pairing
                </div>
                <div className="text-xs text-amber-300 font-mono">
                  {citrusIntensity > 65
                    ? 'Raw Hokkaido scallops, yuzu kosho crudo, light chanterelles'
                    : 'Smoked duck breast, charred leeks, alpine gruyère'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Formula Status:</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Cryo-Stable Equilibrium</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
