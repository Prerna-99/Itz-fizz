import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EffervescenceScience } from './components/EffervescenceScience';
import { FlavorFormulations, Formulation } from './components/FlavorFormulations';
import { SensoryLab } from './components/SensoryLab';
import { TastingRitual } from './components/TastingRitual';
import { ReserveDrawer } from './components/ReserveDrawer';
import { Footer } from './components/Footer';

export default function App() {
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [reservedItems, setReservedItems] = useState<Formulation[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Global scroll listener for the subtle top progress line
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToReserve = (formulation: Formulation) => {
    setReservedItems((prev) => {
      if (prev.some((item) => item.id === formulation.id)) {
        return prev;
      }
      return [...prev, formulation];
    });
  };

  const handleScrollToExplore = () => {
    const effervescenceSection = document.getElementById('effervescence');
    if (effervescenceSection) {
      effervescenceSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-neutral-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-amber-400 selection:text-black">
      {/* Top Global Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-300 to-amber-400 z-[60] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* 3-Zone Compliant Navigation */}
      <Navbar 
        onOpenReserve={() => setIsReserveOpen(true)} 
        reserveCount={reservedItems.length}
      />

      {/* 1. Hero Section Layout with Letter-Spaced Headline, Statistics, and Scroll Animation */}
      <main className="flex-1 w-full">
        <HeroSection onExplore={handleScrollToExplore} />

        {/* 2. Micro-Effervescence Science & Live Pressure Simulator */}
        <EffervescenceScience />

        {/* 3. Flagship Botanical Formulations */}
        <FlavorFormulations onAddToReserve={handleAddToReserve} />

        {/* 4. Sensory Architecture Lab */}
        <SensoryLab />

        {/* 5. Tasting Ritual & Proof Rigor */}
        <TastingRitual />
      </main>

      {/* 6. Strict Compliant Quiet Footer */}
      <Footer />

      {/* Interactive Reservation Drawer */}
      <ReserveDrawer
        isOpen={isReserveOpen}
        onClose={() => setIsReserveOpen(false)}
        selectedItems={reservedItems}
      />
    </div>
  );
}
