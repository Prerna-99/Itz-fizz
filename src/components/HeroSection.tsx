import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowDown, Droplets, ShieldCheck, Zap, HeartHandshake, Rotate3d } from 'lucide-react';
import heroCanImage from '../assets/images/hero_can_fizzy_1791121515179.jpg';
import { ThreeCanViewer } from './ThreeCanViewer';
import { audioEngine } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface MetricItem {
  id: string;
  targetValue: number;
  prefix?: string;
  suffix: string;
  decimals: number;
  label: string;
  subtext: string;
  icon: React.ReactNode;
}

const METRICS: MetricItem[] = [
  {
    id: 'effervescence',
    targetValue: 99.4,
    suffix: '%',
    decimals: 1,
    label: 'Micro-Bubble Retention',
    subtext: 'Pressure sustained 45 min post-opening at 4°C',
    icon: <Droplets className="w-4 h-4 text-amber-400" />
  },
  {
    id: 'sensory',
    targetValue: 142,
    prefix: '+',
    suffix: '%',
    decimals: 0,
    label: 'Olfactory Palate Lift',
    subtext: 'Cold-pressed volatile botanical aroma expansion',
    icon: <Zap className="w-4 h-4 text-amber-400" />
  },
  {
    id: 'sugar',
    targetValue: 0.0,
    suffix: '%',
    decimals: 1,
    label: 'Added Sugar & Extracts',
    subtext: 'Zero stevia, zero erythritol, zero concentrates',
    icon: <ShieldCheck className="w-4 h-4 text-amber-400" />
  },
  {
    id: 'bioactive',
    targetValue: 88.5,
    suffix: '%',
    decimals: 1,
    label: 'Mineral Bioavailability',
    subtext: 'Alpine electrolytic infusion cellular uptake',
    icon: <HeartHandshake className="w-4 h-4 text-amber-400" />
  }
];

export const HeroSection: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineLettersRef = useRef<HTMLSpanElement[]>([]);
  const metricsContainerRef = useRef<HTMLDivElement>(null);
  const visualElementRef = useRef<HTMLDivElement>(null);
  const floatingAuraRef = useRef<HTMLDivElement>(null);
  const bubblesCanvasRef = useRef<HTMLCanvasElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // View mode: 3D interactive WebGL vs Studio Photo
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');

  // Animated metric counters state
  const [metricDisplayValues, setMetricDisplayValues] = useState<number[]>([0, 0, 0, 0]);

  // Split headline text into characters: "W E L C O M E   I T Z F I Z Z"
  const phrase = "WELCOME ITZ FIZZ";
  const words = phrase.split(' ');

  // Canvas particle bubbles effect
  useEffect(() => {
    const canvas = bubblesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle bubbles
    interface Bubble {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      alpha: number;
      wobble: number;
      wobbleSpeed: number;
    }

    const bubbleCount = 42;
    const bubbles: Bubble[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.5 + Math.random() * 3.5,
        speedY: 0.6 + Math.random() * 1.4,
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: 0.2 + Math.random() * 0.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      bubbles.forEach((b) => {
        b.y -= b.speedY;
        b.wobble += b.wobbleSpeed;
        b.x += Math.sin(b.wobble) * 0.4 + b.speedX;

        if (b.y < -10) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${b.alpha * 0.5})`;
        ctx.fill();

        // Little glint
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.8})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP Initial Load + Scroll-Based Animation Setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. INITIAL LOAD TIMELINE:
      const introTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // Staggered reveal of letter-spaced headline letters
      introTl.fromTo(
        headlineLettersRef.current,
        {
          opacity: 0,
          y: 35,
          scale: 0.9,
          filter: 'blur(6px)'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          stagger: 0.035,
          duration: 1.1
        },
        0.1
      );

      // Smooth entrance of the main visual element (can & aura)
      introTl.fromTo(
        visualElementRef.current,
        {
          opacity: 0,
          scale: 0.85,
          y: 50,
          rotateZ: -3
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateZ: 0,
          duration: 1.4,
          ease: 'expo.out'
        },
        0.3
      );

      // Floating aura breathing loop
      if (floatingAuraRef.current) {
        gsap.to(floatingAuraRef.current, {
          scale: 1.12,
          opacity: 0.45,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Statistics animate in one by one with subtle delay
      const metricCards = metricsContainerRef.current?.querySelectorAll('.metric-card');
      if (metricCards) {
        introTl.fromTo(
          metricCards,
          {
            opacity: 0,
            y: 30,
            scale: 0.96
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.9,
            ease: 'power2.out'
          },
          0.6
        );
      }

      // Animated metric number counter (proxy objects to interpolate smoothly)
      const counterProxies = METRICS.map(() => ({ val: 0 }));
      METRICS.forEach((metric, index) => {
        gsap.to(counterProxies[index], {
          val: metric.targetValue,
          duration: 2.2,
          delay: 0.7 + index * 0.12,
          ease: 'power3.out',
          onUpdate: () => {
            setMetricDisplayValues((prev) => {
              const updated = [...prev];
              updated[index] = counterProxies[index].val;
              return updated;
            });
          }
        });
      });

      // Scroll indicator pulse
      if (scrollIndicatorRef.current) {
        introTl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.8 },
          1.2
        );
      }

      // 2. SCROLL-BASED ANIMATION (Core Feature):
      // Tied to scroll progress, not time-based autoplay.
      // Easing / interpolation via scrub: 1.2
      if (containerRef.current && visualElementRef.current) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true
          }
        });

        // Visual Element translation, rotation, scale, and perspective glide on scroll
        scrollTl.to(visualElementRef.current, {
          yPercent: 32,
          scale: 1.15,
          rotateZ: -7,
          rotateY: 12,
          filter: 'drop-shadow(0 25px 40px rgba(245, 158, 11, 0.2))',
          transformOrigin: '50% 50%',
          ease: 'none'
        }, 0);

        // Headline letters parallax fade-out as user scrolls down
        scrollTl.to(headlineLettersRef.current, {
          yPercent: -40,
          opacity: 0.1,
          stagger: 0.01,
          ease: 'none'
        }, 0);

        // Metrics parallax shift
        if (metricsContainerRef.current) {
          scrollTl.to(metricsContainerRef.current, {
            yPercent: -20,
            opacity: 0.25,
            ease: 'none'
          }, 0);
        }

        // Scroll indicator disappears quickly
        if (scrollIndicatorRef.current) {
          scrollTl.to(scrollIndicatorRef.current, {
            opacity: 0,
            y: 20,
            ease: 'none'
          }, 0);
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleVisualInteraction = () => {
    audioEngine.playCanOpenSound();
    audioEngine.playBubblePop();
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-12 px-6 sm:px-10 overflow-hidden bg-[#07080c]"
      id="hero"
    >
      {/* Background radial glow & effervescence canvas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          ref={floatingAuraRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-500/15 via-amber-400/5 to-transparent blur-[120px]" 
        />
        <div className="absolute top-10 right-1/4 w-80 h-80 rounded-full bg-amber-600/10 blur-[100px]" />
        <canvas ref={bubblesCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />
      </div>

      {/* Main Hero Container (Above the Fold) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center items-center text-center my-auto">
        
        {/* Editorial Eyebrow kicker (Zero-pill discipline: unboxed clean text) */}
        <div className="mb-4 flex items-center justify-center gap-3 text-xs tracking-[0.28em] uppercase text-neutral-400 font-mono">
          <span>Botanical Effervescence</span>
          <span aria-hidden="true" className="text-amber-400/60">·</span>
          <span className="text-amber-400">Cryo-Infused Cold Press</span>
          <span aria-hidden="true" className="text-amber-400/60">·</span>
          <span>4°C Reserve</span>
        </div>

        {/* 1. LETTER-SPACED HEADLINE: W E L C O M E   I T Z F I Z Z */}
        <div className="relative mb-6 select-none perspective-1000 max-w-5xl">
          <h1 
            className="font-['Syne'] font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[0.24em] sm:tracking-[0.32em] text-white uppercase leading-none drop-shadow-sm flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-10 gap-y-2"
            aria-label="WELCOME ITZ FIZZ"
          >
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-flex whitespace-nowrap">
                {word.split('').map((char, charIndex) => {
                  const flatIndex = (wordIndex === 0 ? charIndex : 7 + charIndex);
                  return (
                    <span
                      key={charIndex}
                      ref={(el) => {
                        if (el) headlineLettersRef.current[flatIndex] = el;
                      }}
                      className="inline-block transition-transform duration-300 hover:text-amber-400 hover:scale-110 cursor-default"
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>
        </div>

        {/* Concise brand proposition */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 font-normal leading-relaxed mb-8 text-balance">
          Sensory sparkling elixirs engineered with micro-carbonation dynamics, wild Japanese yuzu, high-elevation alpine botanicals, and zero synthetic additives.
        </p>

        {/* MAIN VISUAL ELEMENT: Interactive 3D WebGL Canvas with Mode Switch */}
        <div 
          ref={visualElementRef} 
          className="relative w-full max-w-2xl mx-auto my-2 z-20 will-change-transform"
        >
          {/* View Mode Toggle: 3D Interactive WebGL vs Studio Editorial */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setViewMode('3d');
                  audioEngine.playBubblePop();
                }}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-amber-400 text-black font-semibold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Rotate3d className="w-3.5 h-3.5" />
                <span>3D Spatial WebGL</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('photo');
                  audioEngine.playBubblePop();
                }}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'photo'
                    ? 'bg-amber-400 text-black font-semibold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Studio Photo</span>
              </button>
            </div>
          </div>

          {viewMode === '3d' ? (
            <div className="relative w-full flex items-center justify-center">
              <ThreeCanViewer onCanClick={handleVisualInteraction} />
            </div>
          ) : (
            <div 
              onClick={handleVisualInteraction}
              className="relative group cursor-pointer my-2 max-w-xs mx-auto"
              title="Click to release effervescence"
            >
              {/* Outer halo and glow effect */}
              <div className="absolute -inset-6 bg-gradient-to-r from-amber-500/20 via-amber-300/10 to-amber-600/20 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              {/* The Hero Can Vessel Container */}
              <div className="relative w-56 sm:w-64 md:w-72 aspect-square mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-neutral-950/80 transition-all duration-500 group-hover:border-amber-400/50">
                <img 
                  src={heroCanImage} 
                  alt="ITZ FIZZ Ice-Cold Botanical Sparkling Can with condensation and micro-bubbles"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/15 pointer-events-none" />
                
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/75 backdrop-blur-md rounded-md border border-white/10 text-[10px] uppercase font-mono tracking-widest text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap flex items-center gap-1.5 pointer-events-none">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Tap to crack fizz</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 2. IMPACT METRICS / STATISTICS (Percentages with short descriptions) */}
      <div 
        ref={metricsContainerRef}
        className="relative z-10 max-w-6xl mx-auto w-full mt-4 sm:mt-6"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {METRICS.map((metric, index) => {
            const rawVal = metricDisplayValues[index] || 0;
            const formattedVal = metric.decimals > 0 ? rawVal.toFixed(metric.decimals) : Math.round(rawVal);

            return (
              <div
                key={metric.id}
                className="metric-card glass-panel glass-panel-hover p-4 sm:p-5 rounded-xl border border-white/[0.08] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    {metric.label}
                  </span>
                  <div className="p-1 rounded bg-white/[0.04]">
                    {metric.icon}
                  </div>
                </div>

                <div className="my-1">
                  <span className="font-['Syne'] font-bold text-2xl sm:text-3xl lg:text-4xl text-white font-mono tabular-nums tracking-tight">
                    {metric.prefix}{formattedVal}{metric.suffix}
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-neutral-400 leading-snug line-clamp-2 mt-1">
                  {metric.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div 
        ref={scrollIndicatorRef} 
        className="relative z-10 flex flex-col items-center justify-center mt-6 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        onClick={onExplore}
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1">Scroll to Explore Flow</span>
        <ArrowDown className="w-4 h-4 animate-bounce text-amber-400" />
      </div>
    </section>
  );
};
