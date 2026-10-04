import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { audioEngine } from '../utils/audio';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    audioEngine.playBubblePop();
    setSubscribed(true);
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#050609] py-16 px-6 sm:px-10 text-neutral-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-['Syne'] font-bold text-xl tracking-[0.25em] text-white uppercase block">
              ITZ FIZZ
            </span>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
              Botanical sparkling elixirs engineered through micro-carbonation dynamics and alpine cryogenic infusion. Zero refined sugars, zero artificial extracts.
            </p>
            <div className="text-xs font-mono text-neutral-500">
              Alpine Laboratory & Bottling Facility · Zurich & Kyoto
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-xs uppercase font-mono tracking-widest text-neutral-300 mb-3">
              Exploration
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="hover:text-amber-400 transition-colors">Hero Overview</a>
              </li>
              <li>
                <a href="#effervescence" className="hover:text-amber-400 transition-colors">Micro-Effervescence Science</a>
              </li>
              <li>
                <a href="#formulations" className="hover:text-amber-400 transition-colors">Botanical Formulations</a>
              </li>
              <li>
                <a href="#ritual" className="hover:text-amber-400 transition-colors">Sommelier Pouring Ritual</a>
              </li>
            </ul>
          </div>

          {/* Reserve Dispatch Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs uppercase font-mono tracking-widest text-neutral-300">
              Cellar Dispatch Notes
            </div>
            <p className="text-xs text-neutral-400">
              Receive notifications for seasonal micro-batch botanical pressings.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Subscribed to seasonal cellar notices.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#10121a] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-lg transition-colors flex items-center justify-center shrink-0"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quiet Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} ITZ FIZZ Botanical Beverage Co. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Recyclable Aluminum</span>
            <span aria-hidden="true">·</span>
            <span>Carbon Neutral Certified</span>
            <span aria-hidden="true">·</span>
            <span>Organic Certified Harvest</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
