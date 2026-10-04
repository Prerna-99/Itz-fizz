import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Package } from 'lucide-react';
import { Formulation } from './FlavorFormulations';
import { audioEngine } from '../utils/audio';

interface ReserveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: Formulation[];
}

export const ReserveDrawer: React.FC<ReserveDrawerProps> = ({ isOpen, onClose, selectedItems }) => {
  const [packSize, setPackSize] = useState<'12' | '24'>('12');
  const [flavorPreference, setFlavorPreference] = useState<string>('mixed');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please provide your full recipient name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid shipping notification email.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your delivery city or region.');
      return;
    }

    setIsSubmitting(true);
    audioEngine.playCanOpenSound();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      const code = 'FIZZ-' + Math.floor(100000 + Math.random() * 900000);
      setConfirmationCode(code);
    }, 600);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="w-full max-w-lg bg-[#0c0e16] border-l border-white/10 h-full overflow-y-auto flex flex-col justify-between p-6 sm:p-8 relative shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reserve-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Close reservation drawer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="my-auto py-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            
            <h3 className="font-['Syne'] font-bold text-2xl sm:text-3xl text-white uppercase">
              Allocation Reserved
            </h3>

            <p className="text-neutral-300 text-sm max-w-sm mx-auto leading-relaxed">
              Your {packSize}-can botanical allocation has been scheduled for temperature-controlled cold dispatch to <span className="text-white font-medium">{city}</span>.
            </p>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-center">
              <span className="block text-[11px] uppercase text-neutral-400">Reservation Reference</span>
              <span className="text-xl font-bold text-amber-400 tracking-wider">{confirmationCode}</span>
            </div>

            <div className="text-xs text-neutral-400 font-mono">
              Dispatch notification will be routed to <span className="text-white">{email}</span>.
            </div>

            <button
              onClick={handleReset}
              type="button"
              className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all"
            >
              Return to Showcase
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <div className="text-xs uppercase font-mono tracking-[0.2em] text-amber-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reserve Direct Cellar Allocation</span>
                </div>
                <h3 id="reserve-title" className="font-['Syne'] font-bold text-2xl sm:text-3xl text-white uppercase">
                  Tasting Crate
                </h3>
              </div>

              {/* Selected quick items preview */}
              {selectedItems.length > 0 && (
                <div className="mb-6 p-3.5 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs">
                  <span className="font-mono text-amber-300 block mb-1">Queued Selection:</span>
                  <div className="text-neutral-200">
                    {selectedItems.map((s) => s.name).join(' & ')}
                  </div>
                </div>
              )}

              {/* Pack Size Selector */}
              <div className="mb-6">
                <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-2">
                  1. Crate Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPackSize('12')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      packSize === '12'
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-['Syne'] font-bold text-sm text-white">12-Can Tasting Crate</div>
                    <div className="text-xs font-mono text-amber-300 mt-0.5">$48 USD · Cold Pack</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPackSize('24')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      packSize === '24'
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-['Syne'] font-bold text-sm text-white">24-Can Cellar Reserve</div>
                    <div className="text-xs font-mono text-amber-300 mt-0.5">$88 USD · Free Cold Freight</div>
                  </button>
                </div>
              </div>

              {/* Flavor Profile Choice */}
              <div className="mb-6">
                <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-2">
                  2. Botanical Curation
                </label>
                <select
                  value={flavorPreference}
                  onChange={(e) => setFlavorPreference(e.target.value)}
                  className="w-full bg-[#121522] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="mixed">Balanced Flight (Equal Split Yuzu & Blackberry)</option>
                  <option value="yuzu">Strictly Yuzu Pomelo & Wild Shiso</option>
                  <option value="blackberry">Strictly Wild Blackberry & Crushed Hibiscus</option>
                </select>
              </div>

              {/* Recipient Details */}
              <div className="space-y-4 mb-6">
                <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400">
                  3. Delivery Coordinates
                </label>

                <div>
                  <input
                    type="text"
                    placeholder="Full Recipient Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#121522] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Recipient Email for Cold Tracking"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121522] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="City & Country (e.g. New York, USA)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#121522] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-400 font-mono mt-1">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions & Trust */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Cold-chain guaranteed delivery at 4°C · Eco-insulated</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Securing Cold Allocation...</span>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    <span>Confirm Tasting Reservation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
