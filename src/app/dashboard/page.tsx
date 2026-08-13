"use client";

import { useState, useRef } from 'react';
import { UploadCloud, ArrowRight, Download, X } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function GeneratorPage() {
  const [tab, setTab] = useState<'BUILDER' | 'PFP'>('BUILDER');
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [title, setTitle] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (cardRef.current) {
      setIsGenerating(true);
      try {
        // Temporarily hide the generate button from the snapshot by manipulating DOM or state?
        // Actually, it's fine if the button is in the snapshot, or we can use a class to hide it during capture
        const dataUrl = await toPng(cardRef.current, { 
          cacheBust: true, 
          pixelRatio: 2,
          filter: (node) => {
            // Exclude the generate button container from the snapshot
            if (node.id === 'generate-controls') return false;
            return true;
          }
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
    const text = encodeURIComponent("Check out my HackerHouse Goa 2026 Builder Pass! #FrameInGoa");
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.download = 'hh-goa-builder-pass.png';
      link.href = generatedImage;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 md:p-8 overflow-hidden font-sans">
      {generatedImage ? (
        <div className="z-50 flex flex-col items-center animate-in fade-in zoom-in duration-300 max-w-4xl w-full">
          <div className="flex justify-between w-full mb-4">
            <h2 className="text-2xl font-bold text-hh-yellow">Your Builder Pass is Ready!</h2>
            <button onClick={() => setGeneratedImage(null)} className="text-gray-400 hover:text-white"><X size={28} /></button>
          </div>
          <img src={generatedImage} alt="Generated Pass" className="w-full h-auto rounded-xl shadow-2xl border border-white/20 mb-8" />
          
          <div className="flex gap-4">
            <button 
              onClick={downloadImage}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 font-bold transition-all border border-white/20"
            >
              <Download size={20} /> Download Image
            </button>
            <button 
              onClick={shareToX}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-bold transition-all border border-hh-green hover:shadow-[0_0_15px_rgba(74,222,128,0.5)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg> Share to X
            </button>
          </div>
        </div>
      ) : (
        <div 
          ref={cardRef}
          className="relative w-full max-w-[1000px] flex flex-col md:flex-row bg-[#05050A] rounded-2xl overflow-hidden shadow-2xl border border-white/5"
        >
          {/* LEFT SIDE: BRANDING */}
          <div className="relative w-full md:w-1/2 bg-grid flex p-6 md:p-8 min-h-[500px] md:min-h-[600px] border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
            {/* Abstract Wireframe Map Placeholder */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-hh-green" fill="none" strokeWidth="0.2">
                <path d="M10,20 L30,10 L50,40 L20,60 Z M30,10 L70,15 L80,50 L50,40 M70,15 L90,30 L85,70 L80,50 M20,60 L50,40 L60,80 L30,90 Z M50,40 L80,50 L60,80 M85,70 L95,90 L60,80" />
                <path d="M0,30 L10,20 L20,60 L0,70 Z M90,30 L100,40 L95,90 L85,70 Z" stroke="#00f0ff" />
              </svg>
            </div>

            {/* Vertical "GOA 2026" Text */}
            <div className="absolute left-4 top-8 bottom-32 flex items-center">
              <span className="text-[120px] font-black leading-none tracking-tighter text-outline select-none" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                GOA 2026
              </span>
            </div>

            {/* Logo area */}
            <div className="absolute bottom-8 left-8 flex flex-col">
              <div className="text-6xl font-black tracking-tighter leading-[0.8] mb-2">
                <div className="glitch-text text-hh-yellow" data-text="HH">HH</div>
                <div className="glitch-text text-hh-pink" data-text="GOA">GOA</div>
              </div>
              <div className="text-hh-yellow text-sm font-bold tracking-widest mt-2 uppercase">
                Hacker House Goa
              </div>
              <div className="text-gray-400 text-xs font-mono mt-1 tracking-widest uppercase">
                Goa, India • 20-23 Oct 2026
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: FORM */}
          <div className="relative w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-black/40 backdrop-blur-sm z-10">
            {/* Tabs */}
            <div className="flex gap-8 mb-6 border-b border-white/10">
              <button 
                className={`text-sm font-bold tracking-widest uppercase transition-colors pb-3 border-b-2 ${tab === 'BUILDER' ? 'text-hh-yellow border-hh-yellow' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                onClick={() => setTab('BUILDER')}
              >
                Builder ID
              </button>
              <button 
                className={`text-sm font-bold tracking-widest uppercase transition-colors pb-3 border-b-2 ${tab === 'PFP' ? 'text-hh-yellow border-hh-yellow' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                onClick={() => setTab('PFP')}
              >
                PFP Frame
              </button>
            </div>

            {/* Upload Area */}
            <div className="relative w-full h-[220px] mb-6 glow-box rounded-lg bg-gradient-to-b from-hh-pink/10 to-transparent flex items-center justify-center p-1 group shrink-0">
              {/* Targeting Corners */}
              <div className="corner-bracket corner-tl" />
              <div className="corner-bracket corner-tr" />
              <div className="corner-bracket corner-bl" />
              <div className="corner-bracket corner-br" />

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/jpeg, image/png, image/heic"
                className="hidden"
              />

              {image ? (
                <div className="relative w-full h-full rounded-md overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-wider uppercase">Change Photo</span>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-full h-full rounded-md border border-dashed border-hh-pink/40 flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-hh-pink/5 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="text-hh-pink mb-4" size={48} strokeWidth={1.5} />
                  <h3 className="text-white font-bold mb-2">DRAG & DROP OR CLICK TO<br/>UPLOAD PHOTO</h3>
                  <p className="text-xs text-gray-400 max-w-[200px]">JPG • PNG • HEIC — STRAIGHT FROM YOUR PHONE. NO CROPPING REQUIRED.</p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            {tab === 'BUILDER' && (
              <div className="flex flex-col gap-4 mb-8">
                <div>
                  <label className="text-hh-yellow text-xs font-bold tracking-widest uppercase mb-1 block">Name:</label>
                  <div className="terminal-input-container">
                    <span className="shrink-0 font-mono">{'>'} NAME: [</span>
                    <input 
                      type="text" 
                      className="terminal-input" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      maxLength={20}
                    />
                    <span className="shrink-0 font-mono">]</span>
                  </div>
                </div>

                <div>
                  <label className="text-hh-yellow text-xs font-bold tracking-widest uppercase mb-1 block">Stack / Role:</label>
                  <div className="terminal-input-container">
                    <span className="shrink-0 font-mono">{'>'} STACK_ROLE: [</span>
                    <input 
                      type="text" 
                      className="terminal-input" 
                      placeholder="Full Stack, AI/ML"
                      value={role} 
                      onChange={e => setRole(e.target.value)} 
                      maxLength={30}
                    />
                    <span className="shrink-0 font-mono">]</span>
                  </div>
                </div>

                <div>
                  <label className="text-hh-yellow text-xs font-bold tracking-widest uppercase mb-1 block">Builder Title:</label>
                  <div className="terminal-input-container">
                    <span className="shrink-0 font-mono">{'>'} TITLE: [</span>
                    <input 
                      type="text" 
                      className="terminal-input" 
                      placeholder="e.g., Terminal Wizard, Code Pirate"
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      maxLength={30}
                    />
                    <span className="shrink-0 font-mono">]</span>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Controls */}
            <div id="generate-controls" className="flex flex-col items-center">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !image}
                className="glass-button w-full py-4 rounded-md text-white font-bold text-lg tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {isGenerating ? 'GENERATING...' : 'GENERATE MY PASS'} <ArrowRight size={20} />
              </button>
              <p className="text-xs text-gray-500 font-mono text-center uppercase max-w-[280px]">
                No email, no signup. Seconds from upload to a shareable builder pass.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
