"use client";

import React, { useEffect, useRef, forwardRef, useState } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue,
  AnimatePresence
} from "framer-motion";
import { 
  Target, Flame, Clock, Trophy, Route, 
  Globe, Cpu, ArrowRight 
} from "lucide-react";
import { cn } from "@/app/components/ui/utils"; 

/* ================= COMPONENT: INTERACTIVE HOVER BUTTON ================= */
const InteractiveHoverButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { text?: string }
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-72 cursor-pointer overflow-hidden rounded-full border border-blue-500/30 bg-background/50 backdrop-blur-md p-5 text-center font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-white transition-all duration-300",
        className,
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-3 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight size={20} />
      </div>
      <div className="absolute left-[12%] top-[42%] h-2 w-2 scale-[1] rounded-full bg-blue-600 transition-all duration-500 ease-in-out group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1] group-hover:rounded-none"></div>
    </button>
  );
});
InteractiveHoverButton.displayName = "InteractiveHoverButton";

/* ================= MAIN PAGE ================= */
export default function WelcomePage({ onFinish }: { onFinish: () => void }) {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / 35);
      mouseY.set((e.clientY - window.innerHeight / 2) / 35);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const gridY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.6]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.1], ["0px", "24px"]);
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    ["rgba(37, 99, 235, 0.25)", "rgba(99, 102, 241, 0.25)", "rgba(139, 92, 246, 0.25)", "rgba(13, 148, 136, 0.25)"]
  );

  return (
    <div ref={containerRef} className="relative bg-[#020202] text-white selection:bg-blue-500 overflow-x-hidden">
      
      {/* 1. GLOBAL BACKGROUND ECOSYSTEM */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ x: smoothMouseX, y: smoothMouseY, backgroundColor: bgColor }} 
          className="absolute top-[-15%] left-[-15%] w-[80%] h-[80%] rounded-full blur-[180px] transition-colors duration-1000" 
        />
        
        <motion.div style={{ y: gridY }} className="absolute inset-0 opacity-[0.15]">
          <svg width="100%" height="110%">
            <pattern id="master-grid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="rgba(59, 130, 246, 0.5)" />
              <path d="M 2 2 L 120 120 M 120 2 L 2 120" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#master-grid)" />
          </svg>
        </motion.div>
        
        <div className="absolute inset-0 opacity-[0.2] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] blur-[0.5px]" />
      </div>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-[100] p-8 flex justify-between items-center backdrop-blur-3xl bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center border border-blue-400/30 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <span className="text-white font-black text-2xl italic">P</span>
          </div>
          <span className="font-black tracking-tighter text-2xl uppercase italic">PATHORA</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
           <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase">System: Operational</span>
           </div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="sticky top-0 h-screen flex flex-col items-center justify-center z-30 pointer-events-none">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity, filter: `blur(${heroBlur})` }} className="text-center px-6">
          <h1 className="text-[11vw] font-black uppercase tracking-tighter leading-[0.8] italic mb-12">
            Welcome To <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">Pathora</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-zinc-500 max-w-2xl mx-auto tracking-[0.4em] uppercase">
            Designed for <span className="text-white">Transcendence.</span>
          </p>
        </motion.div>

        <motion.div style={{ opacity: scrollPromptOpacity }} className="absolute bottom-12 flex flex-col items-center gap-4 text-zinc-600">
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-transparent relative overflow-hidden">
             <motion.div animate={{ y: [0, 48] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="absolute top-0 w-full h-1/3 bg-white" />
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: CTA */}
      <section className="relative h-screen z-40 flex flex-col items-center justify-center backdrop-blur-[4px]">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 uppercase italic leading-[0.85] text-center px-6 mb-20">
          The World is Noisy. <br />
          <span className="text-blue-600 shadow-blue-500/20 drop-shadow-2xl">Pathora is Clear.</span>
        </h2>
        <InteractiveHoverButton text="Start Journey" onClick={onFinish} />
      </section>

      {/* SECTION 3: EQUAL BENTO GRID */}
      <section className="relative z-40 py-48 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 space-y-4">
            <h3 className="text-blue-500 font-bold tracking-[0.4em] uppercase text-xs">Analytics Infrastructure</h3>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">
              Your Progress, <br /> <span className="opacity-20 italic">Quantified.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BentoCard icon={<Target />} activeColor="group-hover:text-blue-400" title="Vector Roadmap" desc="Visualize your journey across multi-dimensional skill vectors. We track the depth of your understanding." />
            <BentoCard icon={<Flame />} activeColor="group-hover:text-orange-400" title="Momentum Loops" desc="Daily velocity tracking to keep your learning engine primed." />
            <BentoCard icon={<Clock />} activeColor="group-hover:text-emerald-400" title="Time Synthesis" desc="Deep-focus analytics to maximize the ROI of your learning hours." />
            <BentoCard icon={<Trophy />} activeColor="group-hover:text-white" title="Milestone Mastery" desc="Unlock industry-standard credentials verified by actual project execution data." />
          </div>
        </div>
      </section>

      {/* SECTION 4: PROTOCOL */}
      <section className="relative z-40 py-48 px-6 bg-[#020202]/80 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-40">System Protocol</h2>
          <div className="grid lg:grid-cols-3 gap-24 relative">
             <div className="hidden lg:block absolute top-[48px] left-[15%] right-[15%] h-[1px] bg-white/10 -z-10">
                <AnimatePresence>
                  {activeStep !== null && (
                    <motion.div 
                      initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} exit={{ opacity: 0, scaleX: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-400 to-teal-500 shadow-[0_0_25px_rgba(59,130,246,0.8)] origin-center"
                    />
                  )}
                </AnimatePresence>
             </div>
             <ProtocolStep num="01" icon={<Globe size={32}/>} title="Diagnostic Scan" desc="We analyze your landscape to find the most efficient path forward." onHover={() => setActiveStep(1)} onLeave={() => setActiveStep(null)} />
             <ProtocolStep num="02" icon={<Cpu size={32}/>} title="Path Synthesis" desc="Our engine generates a personalized curriculum tailored to your schedule." onHover={() => setActiveStep(2)} onLeave={() => setActiveStep(null)} />
             <ProtocolStep num="03" icon={<Route size={32}/>} title="Execution" desc="Achieve inevitable growth through consistent atomic tasks." onHover={() => setActiveStep(3)} onLeave={() => setActiveStep(null)} />
          </div>
        </div>
      </section>

      <footer className="relative z-40 py-24 px-8 border-t border-white/5 text-center bg-black/95 backdrop-blur-3xl">
        <h4 className="font-black tracking-tighter text-2xl uppercase opacity-40 italic">PATHORA</h4>
        <p className="mt-8 text-[10px] tracking-[0.5em] font-bold opacity-30 uppercase">© 2025 Pathora Systems • All Rights Reserved</p>
      </footer>
    </div>
  );
}

/* ================= HELPERS ================= */

function BentoCard({ icon, title, desc, activeColor }: any) {
  return (
    <motion.div 
      whileHover="hover"
      className="relative p-10 rounded-[3rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl flex flex-col justify-between transition-all duration-500 overflow-hidden min-h-[380px] group hover:border-white/80"
    >
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="card-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="rgba(255, 255, 255, 0.4)" />
            <line x1="0" y1="0" x2="60" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#card-pattern)" />
        </svg>
      </div>
      
      {/* INTERNAL HOVER LIGHT SOURCE */}
      <motion.div 
        variants={{ hover: { opacity: 1 } }} 
        initial={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" 
      />

      <motion.div variants={{ hover: { scale: 1.15, rotate: 5 } }} className={cn("w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 relative z-10 transition-all duration-500 text-zinc-400 group-hover:bg-white/10", activeColor)}>
        {React.cloneElement(icon, { size: 28 })}
      </motion.div>
      <div className="relative z-10">
        <h4 className="font-black tracking-tighter uppercase italic mb-4 text-3xl transition-colors group-hover:text-blue-500">{title}</h4>
        <p className="opacity-40 group-hover:opacity-95 transition-opacity font-light text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function ProtocolStep({ num, title, desc, icon, onHover, onLeave }: any) {
  return (
    <motion.div onMouseEnter={onHover} onMouseLeave={onLeave} whileHover="hover" className="relative flex flex-col items-center group cursor-default">
      <div className="relative w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 mb-8 transition-all duration-500 group-hover:text-blue-400 group-hover:border-blue-500 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md">
        <motion.div variants={{ hover: { scale: 1.6, opacity: 0 } }} transition={{ repeat: Infinity, duration: 1.2 }} className="absolute inset-0 bg-blue-600/20 rounded-3xl opacity-0" />
        {icon}
      </div>
      <span className="text-xs font-black text-zinc-600 group-hover:text-blue-500 mb-4 tracking-[0.3em] uppercase transition-colors">{num}</span>
      <h4 className="text-2xl font-bold mb-4 tracking-tight uppercase italic group-hover:text-white transition-colors">{title}</h4>
      <p className="text-zinc-500 text-sm font-light leading-relaxed px-6 group-hover:text-zinc-300 transition-colors">{desc}</p>
    </motion.div>
  );
}