import React from 'react';
import { motion } from 'motion/react';

interface DecorativeBotanicalsProps {
  /** Density of the decorations: 'full' | 'light' */
  density?: 'full' | 'light';
  /** Additional classes */
  className?: string;
}

/**
 * DecorativeBotanicals — premium botanical accent elements
 * placed at the edges of sections to reinforce the natural/latex brand identity.
 *
 * Uses the WhatsApp images from the assets folder as subtle background
 * decorations at 10–20% opacity with slow floating animations.
 *
 * These are hidden on mobile and only enhance the desktop experience.
 */
export default function DecorativeBotanicals({
  density = 'full',
  className = '',
}: DecorativeBotanicalsProps) {
  // Only render on desktop via CSS
  return (
    <div
      className={`hidden lg:block absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* === LEFT SIDE === */}

      {/* Top-left: Large leaf (leaf-1) — rotated, faint */}
      <motion.div
        className="absolute -top-[5%] -left-[6%] w-[360px] opacity-[0.28]"
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
        <img
          src="/images/botanicals/leaf-1.jpeg"
          alt=""
          className="w-full h-auto object-contain"
          style={{ filter: 'blur(0.5px) drop-shadow(0 15px 30px rgba(22,60,34,0.08))', mixBlendMode: 'multiply' }}
          loading="lazy"
        />
      </motion.div>

      {/* Middle-left: Medium botanical (leaf-2) */}
      <motion.div
        className="absolute top-[35%] -left-[8%] w-[280px] opacity-[0.25]"
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
        <img
          src="/images/botanicals/leaf-2.jpeg"
          alt=""
          className="w-full h-auto object-contain"
          style={{ filter: 'blur(0.8px) drop-shadow(0 15px 30px rgba(22,60,34,0.08))', mixBlendMode: 'multiply' }}
          loading="lazy"
        />
      </motion.div>

      {/* Bottom-left: Small plant accent */}
      <motion.div
        className="absolute bottom-[5%] -left-[5%] w-[240px] opacity-[0.25]"
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
        <img
          src="/images/botanicals/leaf-3.jpeg"
          alt=""
          className="w-full h-auto object-contain"
          style={{ filter: 'blur(0.5px) drop-shadow(0 15px 30px rgba(22,60,34,0.08))', mixBlendMode: 'multiply' }}
          loading="lazy"
        />
      </motion.div>

      {/* === RIGHT SIDE === */}

      {/* Top-right: Large botanical */}
      <motion.div
        className="absolute -top-[3%] -right-[6%] w-[380px] opacity-[0.28]"
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
        <img
          src="/images/botanicals/leaf-2.jpeg"
          alt=""
          className="w-full h-auto object-contain"
          style={{ filter: 'blur(0.5px) drop-shadow(0 15px 30px rgba(22,60,34,0.08))', mixBlendMode: 'multiply' }}
          loading="lazy"
        />
      </motion.div>

      {/* Middle-right: Medium branch */}
      <motion.div
        className="absolute top-[45%] -right-[7%] w-[260px] opacity-[0.25]"
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
        <img
          src="/images/botanicals/leaf-1.jpeg"
          alt=""
          className="w-full h-auto object-contain"
          style={{ filter: 'blur(0.8px) drop-shadow(0 15px 30px rgba(22,60,34,0.08))', mixBlendMode: 'multiply' }}
          loading="lazy"
        />
      </motion.div>

      {/* Bottom-right: Small decorative */}
      {density === 'full' && (
        <motion.div
          className="absolute bottom-[8%] -right-[4%] w-[200px] opacity-[0.25]"
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
          <img
            src="/images/botanicals/leaf-3.jpeg"
            alt=""
            className="w-full h-auto object-contain"
            style={{ filter: 'blur(0.5px) drop-shadow(0 15px 30px rgba(22,60,34,0.08))', mixBlendMode: 'multiply' }}
            loading="lazy"
          />
        </motion.div>
      )}

      {/* Floating corner leaves — very subtle */}
      <motion.div
        className="absolute top-[15%] right-[12%] w-[60px] opacity-[0.12]"
        animate={{ y: [0, -4, 0], rotate: [-30, -25, -30] }}
        transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
      >
        <div className="w-full aspect-square rounded-full bg-gradient-to-br from-[#5F8F63]/30 to-transparent" />
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] left-[15%] w-[40px] opacity-[0.12]"
        animate={{ y: [0, 3, 0], rotate: [45, 50, 45] }}
        transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity, delay: 2 }}
      >
        <div className="w-full aspect-square rounded-full bg-gradient-to-tr from-[#A8C99A]/30 to-transparent" />
      </motion.div>
    </div>
  );
}
