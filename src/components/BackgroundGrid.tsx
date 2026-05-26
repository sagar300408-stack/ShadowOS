"use client";

import { motion } from "framer-motion";
import React from "react";

export default function BackgroundGrid() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Absolute dark base overlay */}
      <div className="absolute inset-0 bg-[#030303]" />
      
      {/* Cyber radar grid overlay */}
      <div className="absolute inset-0 cockpit-grid opacity-25" />
      <div className="absolute inset-0 cockpit-radar-dots opacity-35" />

      {/* Radial vignetting mask for command center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#030303_85%)]" />

      {/* Moving scanner bar */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-scanline pointer-events-none" />

      {/* Radar sweep vector line */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-15 hidden lg:block">
        <div className="w-full h-full rounded-full border border-cyan-500/10 relative">
          <div className="absolute inset-16 rounded-full border border-cyan-500/5" />
          <div className="absolute inset-36 rounded-full border border-cyan-500/5" />
          <div className="absolute inset-56 rounded-full border border-cyan-500/5" />
          
          {/* Rotating sweep cone */}
          <div className="absolute inset-0 origin-center animate-radar-sweep">
            <div className="w-1/2 h-1/2 absolute top-0 left-0 bg-gradient-to-tr from-cyan-500/10 to-transparent origin-bottom-right" />
            <div className="w-[1px] h-1/2 absolute top-0 left-1/2 bg-cyan-500/30" />
          </div>
        </div>
      </div>

      {/* Floating active operational data stream nodes */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 3 + 1.5;
          const duration = Math.random() * 20 + 20;
          const delay = Math.random() * -30;
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-400"
              style={{
                width: size,
                height: size,
                left: `${startX}%`,
                top: `${startY}%`,
                boxShadow: "0 0 8px rgba(6, 182, 212, 0.6)",
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 60 - 30, 0],
                opacity: [0.15, 0.75, 0.15],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
