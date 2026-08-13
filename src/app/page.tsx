"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { toPng } from 'html-to-image';
import { X as CloseIcon, ArrowRight, Camera, UploadCloud, ZoomIn, Download, Share2, FolderOpen } from 'lucide-react';

// ─── Animated Section Wrapper ─────────────────────────────────────────
function RevealSection({ children, className = '', id = '', sectionNum }: { children: React.ReactNode; className?: string; id?: string; sectionNum?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {sectionNum && (
        <div className="absolute top-12 left-6 md:left-12 text-[11px] font-mono text-hh-white/30 tracking-[0.2em] uppercase">
          [ {sectionNum} ]
        </div>
      )}
      {children}
    </motion.section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function HHGoaLanding() {
  const [activeTab, setActiveTab] = useState<'BUILDER' | 'PFP'>('BUILDER');
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [title, setTitle] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Photo zoom & drag state
  const [zoom, setZoom] = useState(1);
  const [photoPos, setPhotoPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // Selfie state
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ['0%', '40%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const sunScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  // ─── Photo Handlers ──────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setZoom(1);
        setPhotoPos({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── Selfie Camera ───────────────────────
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1080, height: 1080 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setShowCamera(true);
    } catch {
      alert('Camera access denied. Please upload a photo instead.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // Mirror
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImage(dataUrl);
        setZoom(1);
        setPhotoPos({ x: 0, y: 0 });
      }
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  // ─── Photo Drag ───────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!image) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: photoPos.x, posY: photoPos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPhotoPos({ x: dragStart.current.posX + dx, y: dragStart.current.posY + dy });
  };
  const handlePointerUp = () => setIsDragging(false);

  // ─── Generate Image ──────────────────────
  const handleGenerate = async () => {
    if (cardRef.current) {
      setIsGenerating(true);
      try {
        const dataUrl = await toPng(cardRef.current, { 
          cacheBust: true, 
          pixelRatio: 3, 
          style: { transform: 'none' }
        });
        setGeneratedImage(dataUrl);
      } catch (err) {
        console.error('Failed to generate image', err);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const shareToX = () => {
    const text = encodeURIComponent("Secured my spot for Hacker House Goa 2026. 🌴💻\n\n#FrameInGoa");
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

  const [cardId, setCardId] = useState<number | string>('----');
  useEffect(() => {
    setCardId(Math.floor(Math.random() * 9000 + 1000));
  }, []);

  return (
    <div className="bg-hh-green min-h-screen text-hh-white selection:bg-hh-pink selection:text-white font-sans overflow-x-hidden">
      <div className="noise-overlay" />

      {/* ═══════════════════════════════════════════════════════════════
          01 — HERO: MINIMAL, EDITORIAL, POWERFUL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Abstract Horizon / Sun Background */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: sunScale }}
          className="absolute inset-0 flex flex-col items-center justify-end z-0 pb-[10vh]"
        >
          {/* Giant Sun */}
          <div className="w-[80vw] max-w-[800px] aspect-square rounded-full bg-hh-yellow translate-y-1/2 blur-[1px]" />
        </motion.div>
        
        {/* The Ocean / Horizon Line (Darker bottom half) */}
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-hh-green-dark/80 backdrop-blur-md z-10 border-t border-white/10" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 md:px-12 py-8 z-20 mix-blend-difference text-white">
          <div className="flex gap-4 items-center">
            <span className="font-mono text-xs tracking-widest uppercase">Goa, India</span>
          </div>
          <div className="flex gap-6 items-center">
            <a href="https://hhgoa.com" target="_blank" rel="noreferrer" className="hidden md:inline font-mono text-[10px] tracking-widest uppercase hover:text-hh-pink transition-colors">
              hhgoa.com
            </a>
            <a href="#generator" className="font-mono text-[10px] tracking-widest uppercase border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-all">
              Initialize
            </a>
          </div>
        </div>

        {/* Hero Typography */}
        <motion.div 
          style={{ y: heroY }}
          className="relative z-20 text-center flex flex-col items-center mt-[-10vh] mix-blend-difference text-white"
        >
          <div className="overflow-hidden leading-[0.8] pb-4">
            <motion.h1 
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="editorial-display text-[15vw] md:text-[13rem] lg:text-[16rem]"
            >
              HACKER
            </motion.h1>
          </div>
          <div className="overflow-hidden leading-[0.8] mt-[-2vw]">
            <motion.h1 
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="editorial-display text-[15vw] md:text-[13rem] lg:text-[16rem]"
            >
              HOUSE
            </motion.h1>
          </div>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 md:mt-16 text-hh-white/70 text-base md:text-xl editorial-italic max-w-lg mx-auto"
          >
            One photo. One frame. Everything in place.
          </motion.p>
        </motion.div>

        {/* Hindi Script Badge - Moved outside the difference blend container so it retains its pure pink color */}
        <motion.div 
          style={{ y: heroY }}
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: -4 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.6 }}
          className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-[60%] z-30 pointer-events-none"
        >
          <div className="bg-hh-pink px-8 py-3 transform -skew-x-6 premium-shadow">
            <span className="text-white text-5xl md:text-7xl font-bold tracking-wider" style={{ fontFamily: '"Arial", sans-serif' }}>
              गोवा
            </span>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center z-20"
        >
          <a href="#generator" className="flex flex-col items-center gap-4 group">
            <div className="w-[1px] h-12 bg-white/30 group-hover:bg-hh-yellow group-hover:h-16 transition-all duration-500 ease-out" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/50 group-hover:text-hh-yellow transition-colors">
              Scroll
            </span>
          </a>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          02 — MARQUEE TRANSITION (REFINED)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-4 bg-hh-yellow text-hh-black z-20 overflow-hidden border-y border-hh-yellow/50">
        <div className="flex whitespace-nowrap">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex gap-8 items-center"
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-8 items-center">
                <span className="text-sm md:text-base font-mono uppercase tracking-[0.2em]">28-31 Oct 2026</span>
                <span className="text-hh-pink opacity-50">/</span>
                <span className="text-sm md:text-base font-mono uppercase tracking-[0.2em]">247 Seats</span>
                <span className="text-hh-pink opacity-50">/</span>
                <span className="text-sm md:text-base font-mono uppercase tracking-[0.2em]">#FrameInGoa</span>
                <span className="text-hh-pink opacity-50">/</span>
                <span className="text-sm md:text-base font-mono uppercase tracking-[0.2em]">Less Noise. More Signal.</span>
                <span className="text-hh-pink opacity-50">/</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          03 — GENERATOR SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <RevealSection id="generator" className="w-full min-h-screen py-24 md:py-32 z-20 bg-hh-green-dark bg-subtle-grid" sectionNum="03">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col xl:flex-row gap-16 xl:gap-24 items-start">
          
            {/* LEFT: THE ARTIFACT (Builder Card) */}
            <div className="w-full xl:w-[50%] flex flex-col items-center xl:sticky xl:top-24">
              
              <div className="w-full flex justify-between items-end mb-6 text-hh-white/50 font-mono text-[10px] tracking-widest uppercase">
                <span>Preview</span>
                <span>ID: {cardId}</span>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="w-full max-w-[500px]"
              >
                {/* THE CARD (Capture Node) */}
                <div 
                  ref={cardRef} 
                  className="w-full bg-hh-black premium-border overflow-hidden relative card-shadow"
                >
                  {/* Thin Pink Accent Line */}
                  <div className="w-full h-1 bg-hh-pink" />

                  {/* Header */}
                  <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-hh-black">
                    <div className="editorial-display text-white text-2xl tracking-normal">Hacker House</div>
                    <div className="flex items-center gap-3">
                      <span className="font-sans font-bold text-hh-yellow text-sm tracking-widest">2026</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-hh-pink" />
                    </div>
                  </div>

                  {/* Main Grid Content */}
                  <div className="p-6">
                    {/* Photo Area */}
                    <div 
                      className="w-full aspect-[4/3] bg-[#111] border border-white/5 overflow-hidden relative cursor-move mb-6"
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      style={{ touchAction: 'none' }}
                    >
                      {image ? (
                        <img 
                          src={image} 
                          alt="Builder" 
                          className="w-full h-full object-cover select-none pointer-events-none" 
                          style={{ 
                            transform: `scale(${zoom}) translate(${photoPos.x / zoom}px, ${photoPos.y / zoom}px)`,
                            transformOrigin: 'center center'
                          }}
                          draggable={false}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                          <UploadCloud size={32} strokeWidth={1} className="mb-4" />
                          <span className="font-mono text-[10px] uppercase tracking-widest">Awaiting Visual Data</span>
                        </div>
                      )}
                      
                      {/* Photo overlay badge */}
                      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 border border-white/10">
                        <span className="text-[9px] font-mono text-hh-yellow uppercase tracking-widest">Verified</span>
                      </div>
                    </div>

                    {/* Identity Data */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Identity</div>
                        <h2 className="text-3xl font-sans font-bold text-white uppercase tracking-tight leading-none break-words">
                          {name || 'ANONYMOUS'}
                        </h2>
                      </div>
                      
                      {activeTab === 'BUILDER' && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                          <div>
                            <div className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Stack / Role</div>
                            <div className="text-sm font-mono text-white/90">{role || '—'}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Class</div>
                            <div className="text-sm font-mono text-white/90">{title || '—'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Barcode & Footer */}
                  <div className="px-6 pb-6 pt-2 flex items-end justify-between">
                    <div className="w-1/2 opacity-50">
                      <div className="barcode" />
                      <div className="text-[8px] font-mono text-white/50 mt-1 tracking-widest">HHG-26-ID</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-mono text-hh-pink uppercase tracking-widest mb-1">Open Trials</div>
                      <div className="text-[9px] font-mono text-white/40 uppercase tracking-[0.1em]">Goa, India</div>
                    </div>
                  </div>

                  {/* Promo Footer Line */}
                  <div className="w-full bg-hh-yellow text-hh-black py-1.5 px-6 flex justify-between items-center text-[8px] font-mono uppercase tracking-[0.2em] font-bold">
                    <span>#FrameInGoa</span>
                    <span>hhgoa.com</span>
                  </div>
                </div>
              </motion.div>

              {/* Zoom Slider */}
              {image && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 w-full max-w-[500px] flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4 px-4">
                    <ZoomIn size={14} className="text-white/30 shrink-0" />
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      step="0.05"
                      value={zoom}
                      onChange={e => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-white h-0.5 bg-white/10 appearance-none rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] text-center">
                    Drag photo to reposition
                  </p>
                </motion.div>
              )}
            </div>

            {/* RIGHT: THE TERMINAL (Controls) */}
            <div className="w-full xl:w-[50%] flex flex-col xl:pt-8">
              
              {/* Mode Switcher */}
              <div className="flex gap-4 mb-10 border-b border-white/10 pb-4">
                <button 
                  onClick={() => setActiveTab('BUILDER')}
                  className={`text-xs font-mono uppercase tracking-[0.15em] transition-colors pb-4 -mb-[17px] ${activeTab === 'BUILDER' ? 'text-hh-yellow border-b-2 border-hh-yellow' : 'text-white/40 hover:text-white/70'}`}
                >
                  Builder ID
                </button>
                <button 
                  onClick={() => setActiveTab('PFP')}
                  className={`text-xs font-mono uppercase tracking-[0.15em] transition-colors pb-4 -mb-[17px] ${activeTab === 'PFP' ? 'text-hh-yellow border-b-2 border-hh-yellow' : 'text-white/40 hover:text-white/70'}`}
                >
                  PFP Frame
                </button>
              </div>

              {/* Upload Actions */}
              <div className="mb-10">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Input Data // Visual</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 font-mono text-xs uppercase tracking-[0.1em] transition-colors"
                  >
                    <FolderOpen size={14} /> {image ? 'Replace' : 'Upload'}
                  </button>
                  <button 
                    onClick={startCamera}
                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 font-mono text-xs uppercase tracking-[0.1em] transition-colors"
                  >
                    <Camera size={14} /> Selfie
                  </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/jpeg,image/png,image/heic,image/webp" className="hidden" />
              </div>

              {/* Terminal Panel */}
              <div className="dev-terminal-panel p-6 md:p-8 flex flex-col gap-6 w-full max-w-[550px]">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
                  <span className="text-white/30 text-[10px] font-mono tracking-[0.2em] uppercase">Terminal</span>
                  <span className="text-hh-pink text-[10px] font-mono tracking-[0.2em] uppercase">v2.0.26</span>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-2">
                  <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">{'>'} NAME:</span>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="dev-input text-lg md:text-xl py-2 border-b border-white/10 focus:border-hh-yellow transition-colors" 
                    placeholder="_" 
                    maxLength={20}
                  />
                </div>

                {activeTab === 'BUILDER' && (
                  <>
                    {/* Role */}
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">{'>'} STACK_ROLE:</span>
                      <input 
                        type="text" 
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="dev-input text-lg md:text-xl py-2 border-b border-white/10 focus:border-hh-yellow transition-colors" 
                        placeholder="_" 
                        maxLength={30}
                      />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">{'>'} BUILDER_TITLE:</span>
                      <input 
                        type="text" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="dev-input text-lg md:text-xl py-2 border-b border-white/10 focus:border-hh-yellow transition-colors" 
                        placeholder="_" 
                        maxLength={25}
                      />
                    </div>
                  </>
                )}

                {/* Compile Button */}
                <div className="pt-8">
                  <button 
                    onClick={handleGenerate}
                    disabled={!image || isGenerating}
                    className="w-full bg-white text-black py-4 font-mono font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-hh-yellow transition-colors"
                  >
                    {isGenerating ? '[ Compiling... ]' : '[ Execute Build ]'} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════════════════════════
          04 — FOOTER CTA
      ═══════════════════════════════════════════════════════════════ */}
      <RevealSection className="w-full py-32 bg-hh-black text-hh-white z-20 text-center" sectionNum="04">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="editorial-display text-white text-6xl md:text-8xl mb-8">See You<br/>In Goa.</h2>
          <p className="text-white/40 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] mb-12">
            28-31 Oct 2026 / 247 Seats / Open Trials
          </p>
          <a 
            href="#generator" 
            className="inline-flex items-center gap-4 bg-hh-pink text-white px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors"
          >
            Deploy Identity <ArrowRight size={14} />
          </a>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════════════════════════
          SELFIE CAMERA MODAL
      ═══════════════════════════════════════════════════════════════ */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
          <button onClick={stopCamera} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <CloseIcon size={24} />
          </button>
          
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-8">
            [ Camera Interface ]
          </div>

          <div className="w-full max-w-[480px] aspect-[4/3] bg-[#111] border border-white/10 mb-8 relative overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover" 
              style={{ transform: 'scaleX(-1)' }}
            />
            {/* Camera reticle */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/50" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/50" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/50" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/50" />
            </div>
          </div>

          <button 
            onClick={capturePhoto}
            className="bg-white text-black px-12 py-4 font-mono font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-hh-yellow transition-colors"
          >
            <Camera size={14} /> Capture
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          GENERATED IMAGE OVERLAY
      ═══════════════════════════════════════════════════════════════ */}
      {generatedImage && (
        <div className="fixed inset-0 z-50 bg-hh-green-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
          <button 
            onClick={() => setGeneratedImage(null)} 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-10"
          >
            <CloseIcon size={24} />
          </button>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center max-w-[500px] w-full"
          >
            <h3 className="editorial-display text-white text-5xl md:text-6xl mb-12 text-center">Identity<br/><span className="text-hh-yellow italic">Compiled</span></h3>
            
            <div className="relative w-full mb-12 premium-shadow">
              <img src={generatedImage} alt="Generated Pass" className="w-full h-auto border border-white/10" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={downloadImage}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 font-mono text-xs uppercase tracking-[0.1em] transition-colors flex items-center justify-center gap-2"
              >
                <Download size={14} /> Download
              </button>
              <button 
                onClick={shareToX}
                className="flex-1 bg-hh-yellow hover:bg-white text-black py-4 font-mono text-xs font-bold uppercase tracking-[0.1em] transition-colors flex items-center justify-center gap-2"
              >
                <Share2 size={14} /> Share to X
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
