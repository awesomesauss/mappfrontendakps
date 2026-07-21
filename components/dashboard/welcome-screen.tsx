'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { TextReveal } from '@/components/ui/text-reveal';
import { TextScramble } from '@/components/ui/text-scramble';
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onEnterDashboard: () => void;
}

// Static spinning star inline in text
function StarIcon() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      className="inline-flex items-center justify-center text-white mx-1 align-middle"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <svg
        width="52"
        height="52"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
      </svg>
    </motion.span>
  );
}

export function WelcomeScreen({ onEnterDashboard }: WelcomeScreenProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 30, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 30, mass: 0.5 });

  const spotlightBg = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(200, 210, 255, 0.15) 0%, transparent 70%)`;
  const spotlightGlow = useMotionTemplate`radial-gradient(900px circle at ${springX}px ${springY}px, rgba(120, 140, 255, 0.1) 0%, transparent 65%)`;

  useEffect(() => {
    setMounted(true);

    const initPosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    };

    initPosition();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', initPosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', initPosition);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-black text-slate-100 flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden"
    >
      {/* Dot grid — bottom layer */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />

      {/* Cursor spotlight — reactive via useMotionTemplate */}
      {mounted && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{ background: spotlightGlow }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{ background: spotlightBg }}
          />
        </>
      )}

      {/* Main Hero — above spotlight */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">

        {/* Headline with inline white star */}
        <div className="font-vt323 tracking-wider text-center uppercase leading-none font-normal scanline-text select-none">

          {/* Line 1 */}
          <div className="text-5xl sm:text-6xl lg:text-7xl">
            <TextReveal per="word" preset="fade-in-blur" speedReveal={1.2}>
              The fastest way
            </TextReveal>
          </div>

          {/* Line 2 — star inline between words */}
          <div className="text-5xl sm:text-6xl lg:text-7xl flex items-center justify-center flex-wrap gap-x-3 gap-y-0 my-0.5">
            <motion.span
              initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              to control
            </motion.span>
            {mounted && <StarIcon />}
            <motion.span
              initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              your home
            </motion.span>
          </div>

          {/* Line 3 — dimmer */}
          <div className="text-4xl sm:text-5xl lg:text-6xl text-zinc-400">
            <TextReveal per="word" preset="fade-in-blur" delay={0.3} speedReveal={1.2}>
              in real time
            </TextReveal>
          </div>
        </div>

        {/* Subtitle — div to avoid nested <p> hydration error */}
        <div className="max-w-2xl mx-auto">
          <TextScramble
            as="div"
            duration={1.2}
            speed={0.02}
            className="text-sm sm:text-base font-mono text-zinc-400 text-center leading-relaxed"
          >
            Built-in UI, real-time telemetry, hardware state control, security event logs, memory, and observability.
          </TextScramble>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <button
            onClick={onEnterDashboard}
            className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-zinc-100 hover:bg-white text-black font-mono text-sm font-bold tracking-wide transition-all shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

      </div>
    </div>
  );
}
