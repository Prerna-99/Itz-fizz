import React, { useState } from 'react';
import { Plus, Check, Droplets, Sparkles, Citrus, Flame } from 'lucide-react';
import yuzuImg from '../assets/images/flavour_yuzu_botanical_1791121528953.jpg';
import berryImg from '../assets/images/flavour_berry_hibiscus_1791121541574.jpg';
import { audioEngine } from '../utils/audio';

export interface Formulation {
  id: string;
  number: string;
  name: string;
  tagline: string;
  image: string;
  accentColor: string;
  botanicals: string[];
  acidity: string;
  effervescence: string;
  tastingNotes: string;
  calories: string;
}

export const FORMULATIONS: Formulation[] = [
  {
    id: 'yuzu-shiso',
    number: '01',
    name: 'Yuzu Pomelo & Wild Shiso',
    tagline: 'Cold-pressed Shikoku citrus with peppery alpine shiso leaf.',
    image: yuzuImg,
    accentColor: '#f59e0b',
    botanicals: ['Japanese Yuzu Rind', 'Red Pomelo Pulp', 'Highland Green Shiso', 'Moutan Peony'],
    acidity: 'High Brightness · pH 6.1',
    effervescence: '2.8 Bar · Signature Crisp',
    tastingNotes: 'Sharp sunlit zest, white florals, dry herbaceous lingering finish.',
    calories: '0 kcal · 0g Sugar'
  },
  {
    id: 'blackberry-hibiscus',
    number: '02',
    name: 'Wild Blackberry & Crushed Hibiscus',
    tagline: 'Sun-ripened mountain bramble infused with tart Egyptian hibiscus calyx.',
    image: berryImg,
    accentColor: '#e11d48',
    botanicals: ['Wild Pacific Blackberry', 'Whole Hibiscus Calyx', 'Spearmint Leaf', 'Organic Rosehips'],
    acidity: 'Vibrant Tart · pH 6.0',
    effervescence: '2.6 Bar · Velvety Bead',
    tastingNotes: 'Juicy dark berry crush, structured tannic snap, lingering ruby floral mist.',
    calories: '0 kcal · 0g Sugar'
  }
];

interface FlavorFormulationsProps {
  onAddToReserve: (formulation: Formulation) => void;
}

export const FlavorFormulations: React.FC<FlavorFormulationsProps> = ({ onAddToReserve }) => {
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAdd = (form: Formulation) => {
    audioEngine.playCanOpenSound();
    onAddToReserve(form);
    setAddedIds((prev) => ({ ...prev, [form.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [form.id]: false }));
    }, 1800);
  };

  return (
    <section id="formulations" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-mono text-amber-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Cold-Press Elixirs</span>
          </div>
          <h2 className="font-['Syne'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
            Flagship Formulations
          </h2>
        </div>
        <p className="max-w-md text-neutral-400 text-xs sm:text-sm leading-relaxed">
          Each batch is micro-steeped at 2°C for 72 hours before cryogenic carbonation. No lab-concocted "natural flavorings" — purely real fruit, leaves, and mountain botanicals.
        </p>
      </div>

      {/* Grid of Formulations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {FORMULATIONS.map((item) => {
          const isAdded = !!addedIds[item.id];
          return (
            <div
              key={item.id}
              className="glass-panel rounded-2xl overflow-hidden border border-white/[0.08] hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Product Visual Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c14] via-transparent to-transparent opacity-80" />

                {/* Number Badge (Clean Editorial Numbering) */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded border border-white/10 text-xs font-mono text-white">
                  SPEC {item.number}
                </div>

                {/* Effervescence Tag */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded border border-white/10 text-xs font-mono text-amber-300">
                  {item.effervescence}
                </div>
              </div>

              {/* Formulation Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Syne'] font-bold text-2xl text-white tracking-tight uppercase mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
                    {item.tagline}
                  </p>

                  {/* Botanical Ingredients List (Clean Unboxed Separators) */}
                  <div className="mb-6 pb-6 border-b border-white/[0.08]">
                    <div className="text-[11px] uppercase font-mono tracking-wider text-neutral-400 mb-2">
                      Active Botanical Extraction:
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-200">
                      {item.botanicals.map((botanical, bIdx) => (
                        <React.Fragment key={bIdx}>
                          <span className="hover:text-amber-300 transition-colors">{botanical}</span>
                          {bIdx < item.botanicals.length - 1 && (
                            <span aria-hidden="true" className="text-amber-400/50">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Palate Profile Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-6 text-xs font-mono">
                    <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                      <span className="block text-[10px] text-neutral-400 uppercase">Acidity Profile</span>
                      <span className="text-neutral-200 font-semibold">{item.acidity}</span>
                    </div>
                    <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                      <span className="block text-[10px] text-neutral-400 uppercase">Nutritional</span>
                      <span className="text-amber-300 font-semibold">{item.calories}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={() => handleAdd(item)}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-white hover:bg-neutral-100 text-black shadow-lg hover:shadow-xl active:scale-98'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Added to Tasting Crate</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Add to Tasting Crate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
