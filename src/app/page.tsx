"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { toPng } from 'html-to-image';
import { X as CloseIcon, ArrowRight, Camera, FolderOpen, ZoomIn } from 'lucide-react';
import GoaBeachSVG from './components/GoaBeachSVG';

// ─── Animated Section Wrapper ─────────────────────────────────────────
function RevealSection({ children, className = '', id = '', sectionNum }: { children: React.ReactNode; className?: string; id?: string; sectionNum?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
    >
      {sectionNum && (
        <div className="absolute top-8 left-4 md:left-8 text-[10px] font-mono text-current opacity-30 tracking-widest">
          {sectionNum} //
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
  const heroY = useTransform(scrollYProgress, [0, 0.5], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

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
        video: { facingMode: 'user', width: 640, height: 640 } 
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
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
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
    const text = encodeURIComponent("I'm heading to Hacker House Goa 2026! 🌴💻 #FrameInGoa");
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

  // Unique ID for the card
  const [cardId] = useState(() => Math.floor(Math.random() * 9000 + 1000));

  return (
    <div className="bg-hh-green min-h-screen text-hh-white overflow-hidden">
      <div className="noise-overlay" />

      {/* ═══════════════════════════════════════════════════════════════
          01 — HERO: ARRIVE IN GOA
      ═══════════════════════════════════════════════════════════════ */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative h-screen w-full flex flex-col items-center justify-center z-10 overflow-hidden"
      >
        {/* Goa Beach Illustration Background */}
        <div className="absolute inset-0 z-0">
          <GoaBeachSVG className="w-full h-full" />
        </div>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 md:px-12 py-6 z-20">
          <div className="flex flex-col">
            <span className="text-hh-yellow font-bold text-xs md:text-sm tracking-[0.15em] uppercase">Goa, India</span>
            <span className="text-hh-white/60 font-mono text-[10px] md:text-xs tracking-wider">28 - 31 OCT 2026</span>
          </div>
          <div className="flex gap-3">
            <a href="https://hhgoa.com" target="_blank" rel="noreferrer" className="hidden md:flex text-[10px] font-mono tracking-widest border border-hh-yellow/50 text-hh-yellow px-3 py-1.5 hover:bg-hh-yellow hover:text-hh-black transition-colors uppercase">
              hhgoa.com
            </a>
            <a href="#generator" className="text-[10px] font-mono tracking-widest bg-hh-pink text-white px-4 py-1.5 brutal-border hover:bg-hh-yellow hover:text-hh-black transition-colors uppercase font-bold">
              Make Yours
            </a>
          </div>
        </div>

        {/* Central Typography */}
        <div className="relative z-10 text-center flex flex-col items-center w-full px-4">
          {/* Staggered hero text */}
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
              className="editorial-title text-hh-yellow text-[14vw] md:text-[10rem] lg:text-[13rem] drop-shadow-[0_4px_0_rgba(0,0,0,0.3)]"
            >
              HACKER
            </motion.h1>
          </div>
          <div className="overflow-hidden -mt-[3vw] md:-mt-8">
            <motion.h1 
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.35 }}
              className="editorial-title text-hh-yellow text-[14vw] md:text-[10rem] lg:text-[13rem] drop-shadow-[0_4px_0_rgba(0,0,0,0.3)]"
            >
              HOUSE
            </motion.h1>
          </div>

          {/* Goa badge */}
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: -6 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.6 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] z-20 bg-hh-pink px-8 md:px-14 py-2 md:py-4 brutal-border brutal-shadow-lg cursor-default select-none"
          >
            <span className="text-hh-yellow text-5xl md:text-8xl font-bold" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
              गोवा
            </span>
          </motion.div>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 md:mt-16 text-hh-white/80 text-sm md:text-lg font-serif italic max-w-lg"
          >
            one photo. one frame. everything in place.
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="absolute bottom-8 md:bottom-12 flex flex-col items-center z-20"
        >
          <a href="#generator" className="flex flex-col items-center gap-3 group">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-hh-white/70 group-hover:text-hh-yellow transition-colors">
              scroll to create
            </span>
            <div className="w-[1px] h-10 bg-hh-yellow/50 group-hover:h-14 transition-all duration-300" />
          </a>
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          02 — MARQUEE TRANSITION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-5 bg-hh-yellow text-hh-black z-20 border-y-[3px] border-hh-black overflow-hidden">
        <div className="flex whitespace-nowrap">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="flex gap-6 items-center"
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-6 items-center">
                <span className="text-xl md:text-2xl font-bold uppercase tracking-widest">28-31 Oct 2026</span>
                <span className="text-hh-pink text-lg">✦</span>
                <span className="text-xl md:text-2xl font-bold uppercase tracking-widest">247 Seats</span>
                <span className="text-hh-pink text-lg">✦</span>
                <span className="text-xl md:text-2xl font-bold uppercase tracking-widest">#FrameInGoa</span>
                <span className="text-hh-pink text-lg">✦</span>
                <span className="text-xl md:text-2xl font-bold uppercase tracking-widest">Less Noise. More Signal.</span>
                <span className="text-hh-pink text-lg">✦</span>
                <span className="text-xl md:text-2xl font-bold uppercase tracking-widest">2:47 PM Studio</span>
                <span className="text-hh-pink text-lg">✦</span>
                <span className="text-xl md:text-2xl font-bold uppercase tracking-widest">Goa, India</span>
                <span className="text-hh-pink text-lg">✦</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          03 — GENERATOR SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <RevealSection id="generator" className="w-full min-h-screen py-20 md:py-32 z-20 bg-[#063d23]" sectionNum="03">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          {/* Section Header */}
          <div className="mb-16 md:mb-24 max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight uppercase mb-4 text-hh-white">
              Create Your<br/>Builder Pass
            </h2>
            <p className="text-hh-white/60 text-sm md:text-base max-w-md">
              Upload a photo, add your details, and get an instant, one-of-a-kind identity card. 
              Drawn in your browser. Nothing uploaded.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          
            {/* LEFT: THE ARTIFACT (Rich Builder Card) */}
            <div className="w-full lg:w-[55%] flex flex-col items-center lg:sticky lg:top-24">
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.92, rotateY: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="w-full max-w-[520px]"
              >
                {/* THE CARD (Capture Node) */}
                <div 
                  ref={cardRef} 
                  className="w-full bg-[#0d6e3c] brutal-border overflow-hidden relative"
                  style={{ boxShadow: '12px 12px 0 0 #0d0d0d' }}
                >
                  {/* Diagonal stripe pattern overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{
                    backgroundImage: `repeating-linear-gradient(
                      -45deg,
                      transparent,
                      transparent 10px,
                      #ffe100 10px,
                      #ffe100 12px
                    )`
                  }} />

                  {/* Pink accent bar */}
                  <div className="w-full h-2 bg-hh-pink" />

                  {/* Card Header */}
                  <div className="flex justify-between items-center px-5 py-3 border-b-[3px] border-hh-black bg-hh-green">
                    <div className="flex items-center gap-3">
                      <span className="editorial-title text-hh-yellow text-lg tracking-wider">HACKER HOUSE</span>
                      <span className="bg-hh-pink text-hh-yellow px-2 py-0.5 text-sm font-bold brutal-border" style={{ fontSize: '14px' }}>गोवा</span>
                      <span className="text-hh-white font-bold text-sm">2026</span>
                    </div>
                  </div>

                  {/* Event sub-header */}
                  <div className="flex justify-between items-center px-5 py-2 border-b border-hh-black/30 text-[10px] font-mono text-hh-yellow/70 tracking-widest uppercase bg-hh-green/50">
                    <span>GOA, INDIA · 28-31 Oct 2026</span>
                    <span>Open Trials · HHGOA'26</span>
                  </div>

                  {/* Main Content: Photo + Info */}
                  <div className="flex flex-col md:flex-row">
                    {/* Photo */}
                    <div 
                      className="w-full md:w-[45%] aspect-square bg-hh-black/20 border-r-0 md:border-r-[3px] border-b-[3px] md:border-b-0 border-hh-black overflow-hidden relative cursor-move"
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
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-hh-white/30 gap-2 p-4">
                          <div className="w-16 h-16 border-2 border-dashed border-hh-white/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📷</span>
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-center">Upload Your<br/>Photo</span>
                        </div>
                      )}
                      {/* Open Trials Badge */}
                      <div className="absolute bottom-3 left-3 bg-hh-green/90 brutal-border px-3 py-1.5 backdrop-blur-sm">
                        <div className="text-[9px] font-mono text-hh-yellow tracking-widest uppercase">Open Trials</div>
                        <div className="text-hh-white font-bold text-xl leading-none">247 <span className="text-xs font-normal">SEATS</span></div>
                      </div>
                    </div>

                    {/* Identity Info */}
                    <div className="w-full md:w-[55%] p-5 md:p-6 flex flex-col justify-between bg-hh-green/40 min-h-[200px]">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-hh-white uppercase tracking-tight leading-none mb-4 break-words" style={{ wordBreak: 'break-word' }}>
                          {name || 'Your Name'}
                        </h2>
                        <div className="w-full h-[2px] bg-hh-white/20 mb-4" />
                        
                        {activeTab === 'BUILDER' && (
                          <div className="flex flex-col gap-3">
                            <div>
                              <span className="text-[9px] font-mono text-hh-yellow/80 uppercase tracking-widest">— Stack / Role</span>
                              <p className="text-hh-white/80 text-sm font-mono mt-0.5">{role || 'your stack'}</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-hh-yellow/80 uppercase tracking-widest">— Builder Class</span>
                              <p className="text-hh-white/80 text-sm font-mono mt-0.5">{title || 'your title'}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card date */}
                      <div className="mt-6 text-[9px] font-mono text-hh-white/40 uppercase tracking-widest">
                        GOA, INDIA · 28-31 OCT 2026
                      </div>
                    </div>
                  </div>

                  {/* Card Footer / Promo Bar */}
                  <div className="flex items-center justify-between px-5 py-2.5 bg-hh-black border-t-[3px] border-hh-black text-[10px] font-mono tracking-widest">
                    <div className="flex items-center gap-2">
                      <span className="bg-hh-yellow text-hh-black px-1.5 py-0.5 font-bold">#FrameInGoa</span>
                      <span className="text-hh-white/40">MAKE YOURS →</span>
                    </div>
                    <div className="flex items-center gap-3 text-hh-white/40">
                      <span>GOA, INDIA · 28-31 OCT 2026</span>
                      <span className="hidden md:inline">· HHGOA.COM</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Zoom Slider + Drag hint (below card) */}
              {image && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 w-full max-w-[520px] flex flex-col gap-3"
                >
                  <div className="flex items-center gap-4">
                    <ZoomIn size={14} className="text-hh-white/40 shrink-0" />
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      step="0.05"
                      value={zoom}
                      onChange={e => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-hh-yellow h-1 bg-hh-white/10 appearance-none rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-hh-yellow [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-hh-black [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-hh-white/30 uppercase tracking-widest text-center">
                    Drag to reposition · scroll to zoom
                  </p>
                </motion.div>
              )}

            </div>

            {/* RIGHT: THE CONTROLS */}
            <div className="w-full lg:w-[45%] flex flex-col">
              
              {/* Mode Switcher */}
              <div className="flex gap-3 mb-8">
                <button 
                  onClick={() => setActiveTab('BUILDER')}
                  className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider transition-all brutal-border ${activeTab === 'BUILDER' ? 'bg-hh-pink text-hh-white brutal-shadow' : 'bg-hh-black/40 text-hh-white/60 hover:bg-hh-black/60'}`}
                >
                  Builder ID
                </button>
                <button 
                  onClick={() => setActiveTab('PFP')}
                  className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider transition-all brutal-border ${activeTab === 'PFP' ? 'bg-hh-pink text-hh-white brutal-shadow' : 'bg-hh-black/40 text-hh-white/60 hover:bg-hh-black/60'}`}
                >
                  PFP Frame
                </button>
              </div>

              {/* Upload Section */}
              <div className="mb-8">
                <span className="text-hh-pink text-xs font-bold uppercase tracking-widest mb-3 block">Upload</span>
                <h3 className="text-2xl font-bold uppercase mb-4">Photo</h3>
                
                <div className="flex gap-3 mb-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-hh-pink text-white px-5 py-3 brutal-border brutal-shadow-hover font-bold text-xs uppercase tracking-wider"
                  >
                    <FolderOpen size={16} /> {image ? 'Replace' : 'Browse'}
                  </button>
                  <button 
                    onClick={startCamera}
                    className="flex items-center gap-2 bg-hh-white text-hh-black px-5 py-3 brutal-border brutal-shadow-hover font-bold text-xs uppercase tracking-wider"
                  >
                    <Camera size={16} /> Selfie
                  </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/jpeg,image/png,image/heic,image/webp" className="hidden" />
                <p className="text-[10px] text-hh-white/40 font-mono uppercase tracking-wider">
                  JPG · PNG · WebP · HEIC — straight from your phone.
                </p>
              </div>

              {/* Terminal Panel */}
              <div className="dev-terminal-panel rounded-lg p-5 md:p-6 flex flex-col gap-5 w-full max-w-[500px]">
                
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-3 text-[#666] text-[10px] font-mono tracking-widest uppercase">hh-goa-cli v2.0.26</span>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1 border-b border-white/10 pb-3 focus-within:border-white/25 transition-colors">
                  <span className="text-[#777] text-[11px] font-mono">~/hh-goa $ <span className="text-[#7eb8a8]">set</span> name</span>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="dev-input text-base md:text-lg" 
                    placeholder="your name..." 
                    maxLength={20}
                  />
                </div>

                {activeTab === 'BUILDER' && (
                  <>
                    {/* Role */}
                    <div className="flex flex-col gap-1 border-b border-white/10 pb-3 focus-within:border-white/25 transition-colors">
                      <span className="text-[#777] text-[11px] font-mono">~/hh-goa $ <span className="text-[#7eb8a8]">set</span> stack</span>
                      <input 
                        type="text" 
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="dev-input text-base md:text-lg" 
                        placeholder="e.g. Rust · zk · backend" 
                        maxLength={30}
                      />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-1 border-b border-white/10 pb-3 focus-within:border-white/25 transition-colors">
                      <span className="text-[#777] text-[11px] font-mono">~/hh-goa $ <span className="text-[#7eb8a8]">set</span> title</span>
                      <input 
                        type="text" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="dev-input text-base md:text-lg" 
                        placeholder="e.g. Code Pirate" 
                        maxLength={25}
                      />
                    </div>
                  </>
                )}

                {/* Compile Button */}
                <div className="pt-3">
                  <button 
                    onClick={handleGenerate}
                    disabled={!image || isGenerating}
                    className="w-full bg-hh-pink text-white py-4 brutal-border brutal-shadow-hover font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : 'Generate My Pass'} <ArrowRight size={16} />
                  </button>
                </div>

                <p className="text-[10px] text-[#555] font-mono text-center uppercase tracking-wider">
                  No account · nothing uploaded · #FrameInGoa
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════════════════════════
          04 — FOOTER CTA
      ═══════════════════════════════════════════════════════════════ */}
      <RevealSection className="w-full py-24 md:py-32 bg-hh-black text-hh-white z-20 text-center" sectionNum="04">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="editorial-title text-hh-yellow text-5xl md:text-7xl mb-6">See You<br/>In Goa.</h2>
          <p className="text-hh-white/50 font-mono text-xs md:text-sm uppercase tracking-widest mb-10">
            28-31 Oct 2026 · 247 Seats · Builders Only
          </p>
          <a 
            href="#generator" 
            className="inline-flex items-center gap-3 bg-hh-pink text-white px-8 py-4 brutal-border brutal-shadow-hover font-bold uppercase tracking-widest"
          >
            Create Your Pass <ArrowRight size={18} />
          </a>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════════════════════════
          SELFIE CAMERA MODAL
      ═══════════════════════════════════════════════════════════════ */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-hh-black/95 flex flex-col items-center justify-center p-6">
          <button onClick={stopCamera} className="absolute top-6 right-6 text-hh-white/50 hover:text-white">
            <CloseIcon size={28} />
          </button>
          <h3 className="text-hh-yellow font-bold text-lg uppercase tracking-widest mb-6">Take a Selfie</h3>
          <div className="w-full max-w-[400px] aspect-square brutal-border overflow-hidden bg-hh-black mb-6 relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover" 
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
          <button 
            onClick={capturePhoto}
            className="bg-hh-pink text-white px-8 py-4 brutal-border brutal-shadow-hover font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <Camera size={18} /> Snap
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          GENERATED IMAGE OVERLAY
      ═══════════════════════════════════════════════════════════════ */}
      {generatedImage && (
        <div className="fixed inset-0 z-50 bg-hh-black/95 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
          <button 
            onClick={() => setGeneratedImage(null)} 
            className="absolute top-6 right-6 md:top-10 md:right-10 w-10 h-10 bg-hh-yellow brutal-border brutal-shadow-hover flex items-center justify-center text-hh-black z-10"
          >
            <CloseIcon strokeWidth={3} size={18} />
          </button>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col items-center max-w-[550px] w-full"
          >
            <h3 className="editorial-title text-hh-yellow text-4xl md:text-5xl mb-8 text-center">Identity<br/>Secured ✦</h3>
            
            <div className="relative w-full mb-10">
              <img src={generatedImage} alt="Generated Pass" className="w-full h-auto brutal-border brutal-shadow-lg" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[420px]">
              <button 
                onClick={downloadImage}
                className="flex-1 bg-hh-white text-hh-black brutal-border brutal-shadow-hover py-4 font-bold uppercase tracking-wider text-center text-sm"
              >
                Download
              </button>
              <button 
                onClick={shareToX}
                className="flex-1 bg-hh-pink text-hh-white brutal-border brutal-shadow-hover py-4 font-bold uppercase tracking-wider text-center text-sm flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                Share to X
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
