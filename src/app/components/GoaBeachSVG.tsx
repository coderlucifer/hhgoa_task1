"use client";

import { motion } from 'framer-motion';

export default function GoaBeachSVG({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
      viewBox="0 0 1200 600"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* Sky Gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#085c32" />
          <stop offset="100%" stopColor="#0d6e3c" />
        </linearGradient>
        <linearGradient id="sunReflection" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe100" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffe100" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a5e36" />
          <stop offset="100%" stopColor="#0d6e3c" />
        </linearGradient>
      </defs>

      <rect width="1200" height="600" fill="url(#skyGrad)" />

      {/* Distant Mountains */}
      <path d="M0 380 Q100 340 200 365 Q300 340 400 355 Q500 330 600 350 Q700 335 800 355 Q900 340 1000 360 Q1100 345 1200 370 L1200 420 L0 420 Z" fill="#0a5e36" opacity="0.5" />
      <path d="M0 390 Q150 360 300 380 Q450 355 600 370 Q750 350 900 375 Q1050 360 1200 385 L1200 430 L0 430 Z" fill="#0b6238" opacity="0.6" />

      {/* Sun */}
      <motion.circle
        cx="600"
        cy="360"
        r="80"
        fill="#ffe100"
        initial={{ cy: 400 }}
        animate={{ cy: 360 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
      />
      {/* Sun Rays */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = 600 + Math.cos(angle) * 90;
        const y1 = 360 + Math.sin(angle) * 90;
        const x2 = 600 + Math.cos(angle) * 115;
        const y2 = 360 + Math.sin(angle) * 115;
        if (y1 > 360) return null;
        return (
          <motion.line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#ffe100" strokeWidth="2.5" strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + i * 0.08, duration: 0.4 }}
          />
        );
      })}

      {/* Sun Reflection on Water */}
      <rect x="570" y="380" width="60" height="80" fill="url(#sunReflection)" rx="2" />
      {/* Wavy reflection lines */}
      <path d="M580 400 Q590 398 600 400 Q610 402 620 400" stroke="#ffe100" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M575 415 Q590 413 600 415 Q615 417 625 415" stroke="#ffe100" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M578 430 Q590 428 600 430 Q612 432 622 430" stroke="#ffe100" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Ocean */}
      <path d="M0 400 Q300 390 600 395 Q900 390 1200 400 L1200 460 L0 460 Z" fill="url(#oceanGrad)" />
      {/* Wave lines */}
      <path d="M0 415 Q100 410 200 415 Q300 420 400 415 Q500 410 600 415 Q700 420 800 415 Q900 410 1000 415 Q1100 420 1200 415" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M0 430 Q150 425 300 430 Q450 435 600 430 Q750 425 900 430 Q1050 435 1200 430" stroke="#fff" strokeWidth="1" fill="none" opacity="0.2" />

      {/* Small boat */}
      <g transform="translate(350, 395)">
        <path d="M0 8 Q10 12 20 8 Q10 14 0 8 Z" fill="#fff" stroke="#0d0d0d" strokeWidth="1" />
        <line x1="10" y1="0" x2="10" y2="8" stroke="#0d0d0d" strokeWidth="1" />
        <path d="M10 0 L16 4 L10 5 Z" fill="#fff" stroke="#0d0d0d" strokeWidth="0.5" />
      </g>

      {/* Beach */}
      <path d="M0 455 Q300 440 600 445 Q900 440 1200 450 L1200 600 L0 600 Z" fill="#f5f0e8" />

      {/* Left Palm Tree 1 */}
      <g transform="translate(80, 280)">
        <path d="M12 320 Q8 200 15 0" stroke="#0d6e3c" strokeWidth="6" fill="none" />
        {/* Fronds */}
        <path d="M15 10 Q-30 -20 -60 10" stroke="#0d6e3c" strokeWidth="3" fill="none" />
        <path d="M15 10 Q-20 -30 -40 -20" stroke="#0d6e3c" strokeWidth="3" fill="none" />
        <path d="M15 10 Q40 -25 70 5" stroke="#0b5a33" strokeWidth="3" fill="none" />
        <path d="M15 10 Q30 -35 50 -15" stroke="#0b5a33" strokeWidth="3" fill="none" />
        <path d="M15 10 Q5 -35 0 -30" stroke="#0d6e3c" strokeWidth="3" fill="none" />
        {/* Coconuts */}
        <circle cx="12" cy="15" r="4" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="1" />
        <circle cx="20" cy="13" r="4" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="1" />
      </g>

      {/* Right Palm Tree 1 */}
      <g transform="translate(1050, 300)">
        <path d="M12 300 Q16 180 10 0" stroke="#0d6e3c" strokeWidth="6" fill="none" />
        <path d="M10 10 Q-35 -20 -65 15" stroke="#0d6e3c" strokeWidth="3" fill="none" />
        <path d="M10 10 Q-25 -35 -45 -10" stroke="#0d6e3c" strokeWidth="3" fill="none" />
        <path d="M10 10 Q45 -20 75 10" stroke="#0b5a33" strokeWidth="3" fill="none" />
        <path d="M10 10 Q35 -30 55 -5" stroke="#0b5a33" strokeWidth="3" fill="none" />
        <circle cx="8" cy="15" r="4" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="1" />
        <circle cx="16" cy="13" r="4" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="1" />
      </g>

      {/* Left Palm Tree 2 (closer, bigger) */}
      <g transform="translate(20, 320)">
        <path d="M20 280 Q14 160 22 0" stroke="#0b5a33" strokeWidth="7" fill="none" />
        <path d="M22 10 Q-40 -15 -70 20" stroke="#0b5a33" strokeWidth="3.5" fill="none" />
        <path d="M22 10 Q-25 -40 -50 -15" stroke="#0b5a33" strokeWidth="3.5" fill="none" />
        <path d="M22 10 Q50 -20 80 15" stroke="#0d6e3c" strokeWidth="3.5" fill="none" />
        <path d="M22 10 Q40 -35 60 -10" stroke="#0d6e3c" strokeWidth="3.5" fill="none" />
      </g>

      {/* Right Palm Tree 2 */}
      <g transform="translate(1130, 310)">
        <path d="M10 290 Q14 170 8 0" stroke="#0b5a33" strokeWidth="7" fill="none" />
        <path d="M8 10 Q-40 -15 -75 20" stroke="#0b5a33" strokeWidth="3.5" fill="none" />
        <path d="M8 10 Q-30 -40 -55 -15" stroke="#0b5a33" strokeWidth="3.5" fill="none" />
        <path d="M8 10 Q35 -25 60 10" stroke="#0d6e3c" strokeWidth="3.5" fill="none" />
      </g>

      {/* Center Palm */}
      <g transform="translate(550, 370)">
        <path d="M10 230 Q6 120 12 0" stroke="#0d6e3c" strokeWidth="5" fill="none" />
        <path d="M12 8 Q-30 -15 -55 10" stroke="#0d6e3c" strokeWidth="2.5" fill="none" />
        <path d="M12 8 Q-15 -30 -35 -15" stroke="#0d6e3c" strokeWidth="2.5" fill="none" />
        <path d="M12 8 Q35 -18 55 8" stroke="#0b5a33" strokeWidth="2.5" fill="none" />
        <path d="M12 8 Q25 -30 40 -10" stroke="#0b5a33" strokeWidth="2.5" fill="none" />
      </g>

      {/* Village Houses — Left */}
      {/* House 1 */}
      <g transform="translate(100, 470)">
        <rect x="0" y="20" width="55" height="40" fill="#fff" stroke="#0d0d0d" strokeWidth="2" />
        <path d="M-5 20 L27 0 L60 20 Z" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="2" />
        <rect x="8" y="35" width="12" height="16" fill="#ffe100" stroke="#0d0d0d" strokeWidth="1.5" />
        <rect x="35" y="35" width="12" height="16" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="1.5" />
      </g>
      {/* House 2 */}
      <g transform="translate(180, 475)">
        <rect x="0" y="18" width="50" height="35" fill="#fff" stroke="#0d0d0d" strokeWidth="2" />
        <path d="M-5 18 L25 0 L55 18 Z" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="2" />
        <rect x="10" y="30" width="10" height="14" fill="#ff007f" stroke="#0d0d0d" strokeWidth="1.5" />
        <rect x="30" y="30" width="10" height="14" fill="#ffe100" stroke="#0d0d0d" strokeWidth="1.5" />
      </g>
      {/* House 3 */}
      <g transform="translate(260, 468)">
        <rect x="0" y="22" width="60" height="45" fill="#fff" stroke="#0d0d0d" strokeWidth="2" />
        <path d="M-5 22 L30 0 L65 22 Z" fill="#0b5a33" stroke="#0d0d0d" strokeWidth="2" />
        <rect x="12" y="36" width="12" height="16" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="1.5" />
        <rect x="36" y="36" width="12" height="16" fill="#ff007f" stroke="#0d0d0d" strokeWidth="1.5" />
      </g>

      {/* Village Houses — Right */}
      {/* House 4 */}
      <g transform="translate(880, 468)">
        <rect x="0" y="22" width="55" height="42" fill="#fff" stroke="#0d0d0d" strokeWidth="2" />
        <path d="M-5 22 L27 0 L60 22 Z" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="2" />
        <rect x="8" y="36" width="12" height="16" fill="#ffe100" stroke="#0d0d0d" strokeWidth="1.5" />
        <rect x="35" y="36" width="12" height="16" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="1.5" />
      </g>
      {/* House 5 */}
      <g transform="translate(960, 475)">
        <rect x="0" y="18" width="45" height="35" fill="#ffe100" stroke="#0d0d0d" strokeWidth="2" />
        <path d="M-5 18 L22 0 L50 18 Z" fill="#0b5a33" stroke="#0d0d0d" strokeWidth="2" />
        <rect x="10" y="28" width="10" height="14" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="1.5" />
        <rect x="28" y="28" width="10" height="14" fill="#ff007f" stroke="#0d0d0d" strokeWidth="1.5" />
      </g>

      {/* GOA BEACH Shack */}
      <g transform="translate(770, 455)">
        <rect x="0" y="20" width="80" height="50" fill="#fff" stroke="#0d0d0d" strokeWidth="2" />
        <path d="M-8 20 L40 0 L88 20 Z" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="2" />
        {/* GOA BEACH sign */}
        <rect x="15" y="6" width="50" height="14" rx="2" fill="#ff007f" stroke="#0d0d0d" strokeWidth="1.5" />
        <text x="40" y="16" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">GOA BEACH</text>
        {/* Counter */}
        <rect x="10" y="40" width="60" height="2" fill="#0d0d0d" />
        {/* Bar stools */}
        <line x1="20" y1="42" x2="20" y2="60" stroke="#0d0d0d" strokeWidth="2" />
        <line x1="14" y1="60" x2="26" y2="60" stroke="#0d0d0d" strokeWidth="2" />
        <line x1="45" y1="42" x2="45" y2="60" stroke="#0d0d0d" strokeWidth="2" />
        <line x1="39" y1="60" x2="51" y2="60" stroke="#0d0d0d" strokeWidth="2" />
        <line x1="65" y1="42" x2="65" y2="60" stroke="#0d0d0d" strokeWidth="2" />
        <line x1="59" y1="60" x2="71" y2="60" stroke="#0d0d0d" strokeWidth="2" />
      </g>

      {/* Beach Umbrellas */}
      <g transform="translate(380, 480)">
        <line x1="10" y1="0" x2="10" y2="30" stroke="#0d0d0d" strokeWidth="2" />
        <path d="M-10 0 Q10 -12 30 0 Z" fill="#ffe100" stroke="#0d0d0d" strokeWidth="1.5" />
        {/* Chair */}
        <rect x="-5" y="22" width="30" height="8" rx="1" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="1" transform="rotate(-10, 10, 26)" />
      </g>
      <g transform="translate(460, 485)">
        <line x1="10" y1="0" x2="10" y2="28" stroke="#0d0d0d" strokeWidth="2" />
        <path d="M-8 0 Q10 -10 28 0 Z" fill="#ffe100" stroke="#0d0d0d" strokeWidth="1.5" />
        <rect x="-3" y="20" width="26" height="7" rx="1" fill="#0d6e3c" stroke="#0d0d0d" strokeWidth="1" transform="rotate(-10, 10, 24)" />
      </g>

      {/* Surfboard */}
      <g transform="translate(700, 480) rotate(15)">
        <path d="M0 0 Q3 -20 0 -40 Q-3 -20 0 0 Z" fill="#ffe100" stroke="#0d0d0d" strokeWidth="1.5" />
        <line x1="0" y1="-5" x2="0" y2="-35" stroke="#0d0d0d" strokeWidth="0.8" />
      </g>

      {/* Walking figures */}
      {/* Left figure */}
      <g transform="translate(160, 455)">
        <circle cx="4" cy="0" r="3" fill="#fff" stroke="#0d0d0d" strokeWidth="1" />
        <line x1="4" y1="3" x2="4" y2="14" stroke="#0d0d0d" strokeWidth="1.5" />
        <line x1="4" y1="14" x2="0" y2="22" stroke="#0d0d0d" strokeWidth="1.5" />
        <line x1="4" y1="14" x2="8" y2="22" stroke="#0d0d0d" strokeWidth="1.5" />
        <line x1="4" y1="8" x2="0" y2="12" stroke="#0d0d0d" strokeWidth="1.5" />
        <line x1="4" y1="8" x2="9" y2="5" stroke="#0d0d0d" strokeWidth="1.5" />
      </g>
      {/* Right figure */}
      <g transform="translate(1000, 458)">
        <circle cx="4" cy="0" r="3" fill="#fff" stroke="#0d0d0d" strokeWidth="1" />
        <line x1="4" y1="3" x2="4" y2="14" stroke="#0d0d0d" strokeWidth="1.5" />
        <line x1="4" y1="14" x2="0" y2="22" stroke="#0d0d0d" strokeWidth="1.5" />
        <line x1="4" y1="14" x2="8" y2="22" stroke="#0d0d0d" strokeWidth="1.5" />
        <line x1="4" y1="8" x2="0" y2="4" stroke="#0d0d0d" strokeWidth="1.5" />
        <line x1="4" y1="8" x2="9" y2="12" stroke="#0d0d0d" strokeWidth="1.5" />
      </g>

      {/* Auto rickshaw near shack */}
      <g transform="translate(860, 490)">
        <rect x="0" y="2" width="18" height="14" rx="3" fill="#ffe100" stroke="#0d0d0d" strokeWidth="1.5" />
        <rect x="-8" y="5" width="10" height="10" rx="1" fill="#ffe100" stroke="#0d0d0d" strokeWidth="1.5" />
        <circle cx="0" cy="18" r="4" fill="#0d0d0d" />
        <circle cx="14" cy="18" r="4" fill="#0d0d0d" />
      </g>
    </motion.svg>
  );
}
