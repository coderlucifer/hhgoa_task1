import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-hh-green/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-hh-pink/20 blur-[120px] pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hh-green to-hh-pink flex items-center justify-center text-black font-bold">
            <Terminal size={20} />
          </div>
          <span className="text-xl font-bold tracking-widest uppercase">HackerHouse</span>
        </div>
        <Link 
          href="/dashboard"
          className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium backdrop-blur-md"
        >
          Login
        </Link>
      </nav>

      {/* Main Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-hh-yellow/30 bg-hh-yellow/10 text-hh-yellow mb-8 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-hh-yellow"></span>
          <span className="text-xs font-semibold tracking-wide uppercase">Hackathon Registration Open</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
          Generate Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-hh-green via-hh-yellow to-hh-pink animate-gradient-x">
            Hacker Identity
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          The ultimate ID card generator for HackerHouse participants. Secure your spot, customize your badge, and prepare for the most intense hackathon of the year.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link 
            href="/dashboard" 
            className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-hh-green via-hh-yellow to-hh-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
              Enter Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Decorational ID Card Preview */}
        <div className="mt-24 relative [perspective:1000px]">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
          <div className="w-full max-w-md mx-auto aspect-[1.6] rounded-2xl border border-white/20 bg-black/50 backdrop-blur-md p-6 transform [transform:rotateX(12deg)_rotateY(-10deg)] shadow-2xl shadow-hh-pink/20 hover:[transform:rotateX(0deg)_rotateY(0deg)] transition-transform duration-700 cursor-pointer flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-lg bg-hh-green/20 flex items-center justify-center">
                <Terminal className="text-hh-green" size={24} />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 font-mono">ID // 0x4861636B</div>
                <div className="text-sm font-bold text-hh-pink uppercase">HackerHouse '26</div>
              </div>
            </div>
            
            <div className="text-left">
              <div className="text-3xl font-black mb-1">ALICE W.</div>
              <div className="text-hh-yellow font-mono text-sm">Full-Stack Engineer</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
