'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Multi-layer gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD9E6] via-[#BDBFF2] to-[#A682E6]" />
      <div className="absolute inset-0 bg-gradient-to-tl from-[#A682E6]/40 via-transparent to-[#FFD9E6]/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,217,230,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(166,130,230,0.3),transparent_50%)]" />
      
      {/* Large animated orbs with stronger colors */}
      <motion.div
        className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-[#A682E6]/40 rounded-full blur-3xl"
        animate={{
          x: [0, 150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute top-1/4 -right-20 w-[700px] h-[700px] bg-[#FFD9E6]/40 rounded-full blur-3xl"
        animate={{
          x: [0, -150, 0],
          y: [0, 150, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-0 left-1/3 w-[650px] h-[650px] bg-[#BDBFF2]/40 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Additional medium orbs for more variety */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#E0BBE4]/30 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFC9E0]/30 rounded-full blur-3xl"
        animate={{
          x: [0, 120, 0],
          y: [0, -60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Decorative geometric shapes */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-32 h-32 border-4 border-white/20 rounded-3xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-24 h-24 border-4 border-[#A682E6]/30"
        style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
        animate={{
          rotate: [0, -360],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute top-2/3 left-2/3 w-20 h-20 bg-gradient-to-br from-[#FFD9E6]/30 to-[#BDBFF2]/30 rounded-full"
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Additional decorative shapes */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-16 h-16 border-3 border-[#FFD9E6]/40 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/2 w-28 h-28 border-4 border-[#BDBFF2]/30"
        style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Radial gradient overlays for depth */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(166,130,230,0.15),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_60%,rgba(255,217,230,0.15),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_80%,rgba(189,191,242,0.15),transparent_50%)]" />

      {/* Mouse follower with gradient */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        }}
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
        }}
      />

      {/* Floating particles with varied sizes and colors */}
      {[
        { left: 10, top: 20, size: 3, color: 'bg-white/30' },
        { left: 25, top: 60, size: 2, color: 'bg-[#FFD9E6]/40' },
        { left: 40, top: 15, size: 4, color: 'bg-white/30' },
        { left: 55, top: 75, size: 2, color: 'bg-[#BDBFF2]/40' },
        { left: 70, top: 30, size: 3, color: 'bg-white/30' },
        { left: 85, top: 50, size: 2, color: 'bg-[#A682E6]/40' },
        { left: 15, top: 85, size: 4, color: 'bg-white/30' },
        { left: 90, top: 10, size: 3, color: 'bg-[#FFD9E6]/40' },
        { left: 5, top: 45, size: 2, color: 'bg-white/30' },
        { left: 60, top: 90, size: 3, color: 'bg-[#BDBFF2]/40' },
        { left: 35, top: 25, size: 2, color: 'bg-white/30' },
        { left: 80, top: 70, size: 4, color: 'bg-[#A682E6]/40' },
        { left: 20, top: 55, size: 3, color: 'bg-white/30' },
        { left: 75, top: 40, size: 2, color: 'bg-[#FFD9E6]/40' },
        { left: 45, top: 80, size: 3, color: 'bg-white/30' },
        { left: 95, top: 35, size: 2, color: 'bg-[#BDBFF2]/40' },
        { left: 30, top: 65, size: 4, color: 'bg-white/30' },
        { left: 65, top: 5, size: 3, color: 'bg-[#A682E6]/40' },
        { left: 50, top: 95, size: 2, color: 'bg-white/30' },
        { left: 12, top: 50, size: 3, color: 'bg-[#FFD9E6]/40' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos.color} rounded-full shadow-lg shadow-white/20`}
          style={{
            left: `${pos.left}%`,
            top: `${pos.top}%`,
            width: `${pos.size * 2}px`,
            height: `${pos.size * 2}px`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}

      {/* Diagonal stripes pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 50px,
            rgba(255, 255, 255, 0.1) 50px,
            rgba(255, 255, 255, 0.1) 51px
          )`,
        }}
      />

      {/* Dot pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />
    </div>
  );
};
