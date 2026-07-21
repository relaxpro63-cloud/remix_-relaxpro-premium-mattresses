import React from 'react';
import { motion } from 'motion/react';

interface BlurFadeProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  yOffset?: number;
  blur?: string;
  key?: React.Key | null;
}

export default function BlurFade({
  children,
  duration = 0.5,
  delay = 0,
  yOffset = 8,
  blur = "4px"
}: BlurFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: `blur(${blur})`, y: yOffset }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // modern ease-out
      }}
    >
      {children}
    </motion.div>
  );
}
