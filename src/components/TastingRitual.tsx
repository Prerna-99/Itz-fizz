import React from 'react';
import ritualImg from '../assets/images/lifestyle_tasting_ritual_1791121552924.jpg';
import { Thermometer, Compass, Clock, Award } from 'lucide-react';

export const TastingRitual: React.FC = () => {
  const RITUAL_STEPS = [
    {
      num: '01',
      title: 'Cryo-Chill Calibration',
      detail: 'Rest can in refrigeration until calibrated between 3.8°C and 4.2°C. At this temperature, carbon solubility peaks.',
      icon: <Thermometer className="w-4 h-4 text-amber-400" />
    },
    {
      num: '02',
      title: 'The 45° Ribbed Coupe Pour',
      detail: 'Incline an ultra-thin ribbed crystal coupe or champagne flute at 45 degrees. Pour down the glass sidewall to preserve 98% of the micro-bead tension.',
      icon: <Compass className="w-4 h-4 text-amber-400" />
    },
    {
      num: '03',
      title: 'The Volatile Bloom',
      detail: 'Permit the liquid to rest for exactly 15 seconds. Observe the microscopic bead column as volatile essential oils aerosolize into the ambient airspace.',
      icon: <Clock className="w-4 h-4 text-amber-400" />
    },
    {
      num: '04',
      title: 'Palate Aeration Sip',
      detail: 'Take a moderate first sip. Draw a subtle stream of air across the tongue to trigger the secondary botanical release on the back of the palate.',
      icon: <Award className="w-4 h-4 text-amber-400" />
    }
  ];

  return (
    <section id="ritual" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto border-t border-white/[0.06]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Image with Scrim & Caption */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] aspect-[16/10] sm:aspect-[4/3] bg-neutral-900 group">
            <img 
              src={ritualImg} 
              alt="ITZ FIZZ effervescent pour into ribbed crystal coupe glass"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
                Hospitality Reserve Spec
              </span>
              <p className="text-sm font-['Syne'] font-medium text-white">
                "The sensory distinction between standard soda and ITZ FIZZ is the difference between static noise and high-fidelity acoustics."
              </p>
              <div className="mt-2 text-xs text-neutral-400 font-mono">
                — Julian Vance, Head Sommelier, Atelier Ciel (Zurich)
              </div>
            </div>
          </div>

          {/* Adjacent Proof Rigor */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl glass-panel border border-white/[0.06]">
              <div className="font-['Syne'] font-bold text-2xl text-white font-mono tabular-nums">
                98.2%
              </div>
              <div className="text-xs text-neutral-300 font-medium mt-0.5">Blind Sommelier Preference</div>
              <div className="text-[11px] text-neutral-400 mt-1">Over luxury craft sodas & tonics</div>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-white/[0.06]">
              <div className="font-['Syne'] font-bold text-2xl text-white font-mono tabular-nums">
                12
              </div>
              <div className="text-xs text-neutral-300 font-medium mt-0.5">Michelin Star Cellars</div>
              <div className="text-[11px] text-neutral-400 mt-1">Featured on non-alcoholic pairings</div>
            </div>
          </div>
        </div>

        {/* Right Column: The 4 Steps */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono text-amber-400 mb-2">
              Sensory Experience
            </div>
            <h2 className="font-['Syne'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase mb-4">
              The Four-Step Pouring Ritual
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Designed to optimize volatile aroma extraction and preserve micro-carbonation integrity from vessel to palate.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {RITUAL_STEPS.map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-xl border border-white/[0.06] bg-[#0c0e16]/80 hover:border-white/20 transition-all flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-mono text-xs font-bold text-amber-400">{step.num}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-['Syne'] font-semibold text-base text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
