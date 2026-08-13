"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { toPng } from 'html-to-image';
import { X as CloseIcon, Camera, UploadCloud, Download, Share2, FolderOpen } from 'lucide-react';
import Image from 'next/image';

// ─── Interactive Mouse Parallax ─────────────────────────────────────────
function useMouseParallax() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
}

// ─── Twinkling Stars Component ────────────────────────────────────────
const Stars = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: string; size: string }[]>([]);
  
  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      size: `${Math.random() * 3 + 1}px`
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map(star => (
        <div 
          key={star.id}
          className="absolute bg-white rounded-full star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay
          }}
        />
      ))}
    </div>
  );
};

// ─── Main Landing Page ────────────────────────────────────────────────
export default function HHGoaLanding() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [title, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'BUILDER' | 'PFP'>('BUILDER');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const [cardId, setCardId] = useState<number | string>('----');
  useEffect(() => {
    setCardId(Math.floor(Math.random() * 9000 + 1000));
  }, []);

  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { scrollYProgress } = useScroll();
  const mousePos = useMouseParallax();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
      setGeneratedImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 3 });
      setGeneratedImage(dataUrl);
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareToX = () => {
    const text = encodeURIComponent("Secured my spot for Hacker House Goa 2026. 🌴💻\\n\\n#FrameInGoa");
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.download = 'hh-goa-2026-builder-pass.png';
      link.href = generatedImage;
      link.click();
    }
  };

  return (
    <div className="bg-hh-navy min-h-screen text-hh-sand selection:bg-hh-pink selection:text-white font-sans overflow-x-hidden">
      
      {/* ═══════════════════════════════════════════════════════════════
          01 — ARRIVE IN GOA (Hero Section)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden flex flex-col items-center justify-start bg-hh-navy">
        
        {/* Aspect Ratio Preserving Image Container */}
        <div className="relative w-full max-w-[1920px] mx-auto">
          {/* Base Background Image */}
          <motion.img 
            src="/assets/master-bg.png" 
            alt="Goa Hacker House Night"
            className="w-full h-auto block"
            style={{ 
              x: mousePos.x * -0.5,
              y: mousePos.y * -0.5,
              scale: 1.02
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-hh-navy z-10 pointer-events-none" />

          {/* HACKER HOUSE Logo - Absolutely positioned relative to the image */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[60%] max-w-2xl z-20 pointer-events-none"
          >
            <img src="/assets/logo.png" alt="Hacker House Goa" className="w-full h-auto drop-shadow-2xl" />
          </motion.div>

          {/* Floating Call to Action - Perfectly aligned to the yellow sign */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute top-[57%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-[40%] max-w-xl flex flex-col items-center justify-center"
          >
            <h2 className="editorial-display text-[2vw] md:text-3xl lg:text-5xl text-[#080914] mb-1 font-bold w-full leading-none drop-shadow-none whitespace-nowrap">
              CODE AT THE BEACH
            </h2>
            <p className="font-mono text-[0.8vw] md:text-[10px] lg:text-xs text-[#080914]/80 font-bold tracking-widest uppercase mt-1 md:mt-2">
              Upload your photo. Claim your spot.
            </p>
          </motion.div>
          
          {/* Button pushed down below the yellow sign */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute top-[72%] left-1/2 -translate-x-1/2 z-20"
          >
            <button 
              onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
              className="vector-box-pink px-4 py-2 md:px-8 md:py-4 font-mono text-[10px] md:text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-hh-pink/20 whitespace-nowrap"
            >
              INITIALIZE GENERATOR →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          02 — BUILDER IDENTITY STATION (Generator)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="generator" className="relative z-20 pt-8 pb-20 px-4 max-w-7xl mx-auto">
        
        {/* Structural Bamboo Framing Using Asset */}
        <div 
          className="w-full relative z-30 h-8 md:h-12 mt-4" 
          style={{ 
            backgroundImage: "url('/assets/bamboo-transparent.png')",
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
            backgroundRepeat: "repeat-x"
          }} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 -mt-8 md:-mt-12">
          
          {/* Left Column: Hanging Preview Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Ropes hanging from bamboo */}
            <div className="flex justify-between w-64 relative z-20">
              <motion.div 
                className="rope h-16 origin-top"
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
              <motion.div 
                className="rope h-16 origin-top"
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.2 }}
              />
            </div>
            
            {/* Yellow Board Preview Container */}
            <motion.div 
              className="vector-box-yellow p-4 md:p-6 w-full max-w-md origin-top z-10"
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs font-bold">PREVIEW</span>
                <span className="font-mono text-xs font-bold">ID: {cardId}</span>
              </div>
              
              {/* Actual Generated Card Ref */}
              <div 
                ref={cardRef} 
                className={`relative w-full aspect-[4/5] bg-hh-navy-light border-4 border-[#080914] overflow-hidden flex flex-col p-4 md:p-6 ${
                  activeTab === 'BUILDER' ? '' : 'aspect-square'
                }`}
              >
                {/* Internal card texture/stars */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />
                <div className="absolute top-2 right-2 text-hh-pink opacity-50"><Stars /></div>
                
                {/* Photo Area */}
                <div className="relative w-full flex-grow border-2 border-[#080914] bg-hh-navy-dark overflow-hidden flex items-center justify-center">
                  {image ? (
                    <img src={image} alt="User" className="w-full h-full object-cover filter contrast-125 saturate-110" />
                  ) : (
                    <div className="text-hh-sand/20 flex flex-col items-center">
                      <Camera size={32} className="mb-2" />
                      <span className="font-mono text-xs">NO_IMAGE</span>
                    </div>
                  )}
                  {/* Decorative corner marks */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-hh-yellow m-2 opacity-50" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-hh-yellow m-2 opacity-50" />
                </div>

                {/* Card Data */}
                {activeTab === 'BUILDER' && (
                  <div className="mt-4 flex flex-col pt-4 border-t-2 border-dashed border-[#080914]/20">
                    <h3 className="editorial-display text-4xl text-hh-yellow uppercase truncate">
                      {name || "GUEST"}
                    </h3>
                    <div className="flex justify-between items-end mt-2">
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] text-hh-sand/60">ROLE</span>
                        <span className="font-mono text-sm text-hh-pink font-bold truncate max-w-[150px]">
                          {role || "HACKER"}
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-mono text-[9px] text-hh-sand/60">TITLE</span>
                        <span className="font-mono text-xs text-hh-sand font-bold truncate max-w-[100px]">
                          {title || "ATTENDEE"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'PFP' && (
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <div className="bg-hh-yellow/90 backdrop-blur-sm text-[#080914] font-serif text-2xl py-2 px-4 border-2 border-[#080914]">
                      {name || "HACKER HOUSE GOA"}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Terminal Booth */}
          <div className="lg:col-span-7 flex flex-col pt-12 lg:pt-24 relative z-10">
            <div className="vector-box p-8 md:p-12 relative w-full shack-window">
              <div className="shack-glow" />
              
              <div className="flex justify-between items-center mb-8 border-b-2 border-hh-sand/10 pb-4 relative z-10">
                <h3 className="font-mono text-hh-cyan uppercase tracking-widest text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-hh-pink rounded-full animate-pulse" />
                  STATION_TERMINAL
                </h3>
                
                {/* Tabs */}
                <div className="flex gap-4">
                  {(['BUILDER', 'PFP'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`font-mono text-xs tracking-widest transition-colors ${
                        activeTab === tab ? 'text-hh-yellow border-b-2 border-hh-yellow' : 'text-hh-sand/40 hover:text-hh-sand'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Input */}
              <div className="mb-8 relative z-10">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/heic"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-hh-cyan/30 hover:border-hh-cyan bg-hh-cyan/5 text-hh-cyan py-6 flex flex-col items-center justify-center font-mono text-sm transition-colors cursor-pointer"
                >
                  <FolderOpen size={24} className="mb-2" />
                  {image ? '> REPLACE_IMAGE.jpg' : '> UPLOAD_IMAGE.jpg'}
                </button>
              </div>

              {/* Terminal Form */}
              <div className="space-y-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <span className="text-hh-sand/40 text-[10px] font-mono tracking-widest uppercase">{'>'} NAME:</span>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="shack-input text-lg py-1" 
                    placeholder="Lucifer_" 
                    maxLength={20}
                  />
                </div>

                {activeTab === 'BUILDER' && (
                  <>
                    <div className="flex flex-col gap-2">
                      <span className="text-hh-sand/40 text-[10px] font-mono tracking-widest uppercase">{'>'} STACK_ROLE:</span>
                      <input 
                        type="text" 
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="shack-input text-lg py-1" 
                        placeholder="AI / Full Stack_" 
                        maxLength={30}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-hh-sand/40 text-[10px] font-mono tracking-widest uppercase">{'>'} BUILDER_TITLE:</span>
                      <input 
                        type="text" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="shack-input text-lg py-1" 
                        placeholder="Midnight Builder_" 
                        maxLength={25}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col sm:flex-row gap-4 relative z-10">
                <button 
                  onClick={handleGenerate}
                  disabled={!image || isGenerating}
                  className="flex-1 vector-box-yellow py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-[#fff066] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? 'PROCESSING...' : (
                    <>
                      COMPILE_ID <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Results */}
              {generatedImage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 flex gap-4 relative z-10"
                >
                  <button 
                    onClick={downloadImage}
                    className="flex-1 vector-box py-3 text-hh-cyan font-mono text-sm hover:bg-hh-navy transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> SAVE
                  </button>
                  <button 
                    onClick={shareToX}
                    className="flex-1 vector-box py-3 text-hh-pink font-mono text-sm hover:bg-hh-navy transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 size={16} /> POST TO X
                  </button>
                </motion.div>
              )}
              
            </div>
          </div>
          
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          03 — FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="w-full py-12 text-center relative z-20 bg-hh-navy-dark mt-8">
        <div 
          className="w-full absolute top-[-10px] md:top-[-16px] left-0 h-8 md:h-12 pointer-events-none" 
          style={{ 
            backgroundImage: "url('/assets/bamboo-transparent.png')",
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
            backgroundRepeat: "repeat-x"
          }} 
        />
        <p className="font-mono text-hh-sand/40 text-xs tracking-widest uppercase mt-8 md:mt-12">
          SEE YOU IN GOA • 28-31 OCT 2026
        </p>
      </footer>

    </div>
  );
}

// ArrowRight icon fallback since I missed importing it in the main block
const ArrowRight = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
