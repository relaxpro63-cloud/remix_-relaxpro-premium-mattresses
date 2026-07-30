import React from 'react';
import { motion } from 'motion/react';

interface DecorativeBotanicalsProps {
  /** Density of the decorations: 'full' | 'light' */
  density?: 'full' | 'light';
  /** Additional classes */
  className?: string;
}

/* ─── SVG Botanical Shapes ────────────────────────────── */

/** Large broad leaf — Monstera/Fiddle-leaf style */
function LeafLarge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="leafLg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F7E6A" stopOpacity="0.70" />
          <stop offset="50%" stopColor="#6B9B85" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#A8C99A" stopOpacity="0.40" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M200 470 C200 420 195 350 200 300 C205 250 198 200 200 160" stroke="url(#leafLg)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Left lobe */}
      <path d="M200 160 C180 140 130 130 100 150 C70 170 60 210 80 240 C100 270 140 280 170 260 C190 248 198 220 200 200" fill="url(#leafLg)" />
      {/* Right lobe */}
      <path d="M200 160 C220 135 270 125 300 145 C330 165 340 205 320 235 C300 265 260 275 230 255 C210 243 202 215 200 195" fill="url(#leafLg)" />
      {/* Top lobe */}
      <path d="M200 160 C190 130 175 100 190 80 C205 60 215 65 220 85 C225 105 210 135 200 160" fill="url(#leafLg)" />
      {/* Center vein */}
      <path d="M200 160 C198 200 202 250 200 300" stroke="url(#leafLg)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Side veins */}
      <path d="M200 200 C180 195 155 190 140 195" stroke="url(#leafLg)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M200 200 C220 195 245 190 260 195" stroke="url(#leafLg)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M200 240 C175 235 145 235 125 245" stroke="url(#leafLg)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M200 240 C225 235 255 235 275 245" stroke="url(#leafLg)" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Medium branching leaf cluster */
function LeafMedium({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="leafMed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1568A3" stopOpacity="0.65" />
          <stop offset="50%" stopColor="#6FAEE0" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#A6CDEC" stopOpacity="0.30" />
        </linearGradient>
        <linearGradient id="leafMed2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F7E6A" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#A8C99A" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {/* Main stem */}
      <path d="M150 380 C145 320 140 260 150 200 C160 140 155 80 150 40" stroke="url(#leafMed)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Leaf 1 — left */}
      <path d="M150 320 C120 300 90 310 80 330 C70 350 95 365 120 355 C135 348 145 335 150 325" fill="url(#leafMed)" />
      <path d="M150 320 C130 310 105 315 95 330" stroke="url(#leafMed)" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Leaf 2 — right */}
      <path d="M148 270 C178 248 210 255 220 275 C230 295 205 310 180 300 C165 293 153 280 148 272" fill="url(#leafMed2)" />
      <path d="M148 270 C170 255 200 260 210 275" stroke="url(#leafMed2)" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Leaf 3 — left lower */}
      <path d="M152 220 C125 200 95 205 85 225 C75 245 100 260 120 250 C135 243 147 232 152 222" fill="url(#leafMed)" />
      <path d="M152 220 C130 208 105 212 95 225" stroke="url(#leafMed)" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Leaf 4 — right upper */}
      <path d="M147 160 C175 140 205 148 212 168 C219 188 198 200 178 190 C162 183 150 172 147 162" fill="url(#leafMed2)" />
      <path d="M147 160 C168 145 195 152 205 168" stroke="url(#leafMed2)" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Top bud */}
      <ellipse cx="150" cy="45" rx="12" ry="18" fill="url(#leafMed)" transform="rotate(-15 150 45)" />
    </svg>
  );
}

/** Small delicate leaf */
function LeafSmall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="leafSm" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#B49A73" stopOpacity="0.70" />
          <stop offset="50%" stopColor="#D8C4A4" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#ECE3D5" stopOpacity="0.30" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M100 260 C98 220 102 180 100 140 C98 100 102 60 100 30" stroke="url(#leafSm)" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Leaf body — elegant teardrop */}
      <path d="M100 140 C70 120 40 90 50 65 C60 40 80 35 100 30 C120 35 140 40 150 65 C160 90 130 120 100 140Z" fill="url(#leafSm)" />
      {/* Center vein */}
      <path d="M100 140 C100 100 100 70 100 30" stroke="url(#leafSm)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Side veins */}
      <path d="M100 110 C85 105 72 100 65 95" stroke="url(#leafSm)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M100 110 C115 105 128 100 135 95" stroke="url(#leafSm)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M100 80 C88 76 78 72 72 68" stroke="url(#leafSm)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M100 80 C112 76 122 72 128 68" stroke="url(#leafSm)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Curved vine accent */
function VineAccent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="vine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F7E6A" stopOpacity="0.60" />
          <stop offset="100%" stopColor="#A8C99A" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {/* Flowing vine */}
      <path d="M10 150 C20 120 40 110 60 120 C80 130 100 115 110 90 C115 78 112 60 105 45" stroke="url(#vine)" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Small leaf on vine */}
      <path d="M60 120 C45 110 35 100 40 88 C45 76 58 78 65 90 C70 98 67 110 60 120Z" fill="url(#vine)" />
      <path d="M60 120 C55 108 52 98 55 90" stroke="url(#vine)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      {/* Another small leaf */}
      <path d="M95 105 C82 98 72 88 78 76 C84 64 96 68 102 80 C106 88 102 98 95 105Z" fill="url(#vine)" />
      <path d="M95 105 C90 94 88 85 90 80" stroke="url(#vine)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/**
 * DecorativeBotanicals — premium SVG botanical accent elements
 * placed at the edges of sections to reinforce the natural/latex brand identity.
 *
 * Uses hand-crafted SVG leaf shapes with brand color gradients
 * and slow floating animations. No external image files needed.
 *
 * These are hidden on mobile and only enhance the desktop experience.
 */
export default function DecorativeBotanicals({
  density = 'full',
  className = '',
}: DecorativeBotanicalsProps) {
  return (
    <div
      className={`hidden lg:block absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* === LEFT SIDE === */}

      {/* Top-left: Large leaf */}
      <motion.div
        className="absolute -top-[5%] -left-[6%] w-[320px] opacity-[0.85]"
        animate={{
          y: [0, -10, 0],
          rotate: [-16, -12, -16],
        }}
        transition={{
          duration: 10,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        <LeafLarge className="w-full h-auto" />
      </motion.div>

      {/* Middle-left: Medium branch */}
      <motion.div
        className="absolute top-[35%] -left-[8%] w-[240px] opacity-[0.80]"
        animate={{
          y: [0, 8, 0],
          rotate: [-8, -4, -8],
        }}
        transition={{
          duration: 12,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: 1.5,
        }}
      >
        <LeafMedium className="w-full h-auto" />
      </motion.div>

      {/* Bottom-left: Small leaf */}
      <motion.div
        className="absolute bottom-[5%] -left-[5%] w-[200px] opacity-[0.85]"
        animate={{
          y: [0, -6, 0],
          rotate: [5, 8, 5],
        }}
        transition={{
          duration: 9,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: 3,
        }}
      >
        <LeafSmall className="w-full h-auto" />
      </motion.div>

      {/* === RIGHT SIDE === */}

      {/* Top-right: Large leaf */}
      <motion.div
        className="absolute -top-[3%] -right-[6%] w-[340px] opacity-[0.85]"
        animate={{
          y: [0, -8, 0],
          rotate: [12, 16, 12],
        }}
        transition={{
          duration: 11,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: 2,
        }}
      >
        <LeafLarge className="w-full h-auto" />
      </motion.div>

      {/* Middle-right: Medium branch */}
      <motion.div
        className="absolute top-[45%] -right-[7%] w-[220px] opacity-[0.80]"
        animate={{
          y: [0, 6, 0],
          rotate: [-10, -6, -10],
        }}
        transition={{
          duration: 13,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: 0.5,
        }}
      >
        <LeafMedium className="w-full h-auto" />
      </motion.div>

      {/* Bottom-right: Small decorative */}
      {density === 'full' && (
        <motion.div
          className="absolute bottom-[8%] -right-[4%] w-[180px] opacity-[0.85]"
          animate={{
            y: [0, -5, 0],
            rotate: [-5, -2, -5],
          }}
          transition={{
            duration: 8,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: 4,
          }}
        >
          <LeafSmall className="w-full h-auto" />
        </motion.div>
      )}

      {/* Extra floating vine accents — only on full density */}
      {density === 'full' && (
        <>
          <motion.div
            className="absolute top-[18%] right-[2%] w-[100px] opacity-[0.55]"
            animate={{ y: [0, -5, 0], rotate: [-20, -15, -20] }}
            transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
          >
            <VineAccent className="w-full h-auto" />
          </motion.div>
          <motion.div
            className="absolute bottom-[15%] left-[2%] w-[80px] opacity-[0.55]"
            animate={{ y: [0, 4, 0], rotate: [25, 30, 25] }}
            transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity, delay: 2.5 }}
          >
            <div style={{ transform: 'scaleX(-1)' }}>
              <VineAccent className="w-full h-auto" />
            </div>
          </motion.div>
        </>
      )}

      {/* Floating corner dots — subtle organic accent */}
      <motion.div
        className="absolute top-[15%] right-[12%] w-[48px] opacity-[0.45]"
        animate={{ y: [0, -4, 0], rotate: [-30, -25, -30] }}
        transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
      >
        <div className="w-full aspect-square rounded-full bg-gradient-to-br from-[#4F7E6A]/25 to-transparent" />
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] left-[15%] w-[32px] opacity-[0.45]"
        animate={{ y: [0, 3, 0], rotate: [45, 50, 45] }}
        transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity, delay: 2 }}
      >
        <div className="w-full aspect-square rounded-full bg-gradient-to-tr from-[#A8C99A]/25 to-transparent" />
      </motion.div>
    </div>
  );
}
