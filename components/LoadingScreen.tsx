"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete?.();
          }, 800); // Wait a bit after hitting 100% before completing
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Bottom emojis
  const bottomEmojis = ["💖", "✨", "🌸", "💫", "💗", "🌷", "💖", "🌸", "✨", "💗"];

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center font-sans z-10"
    >
      {/* Main Content */}
      <div className="z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl">
        <motion.div
          animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl md:text-7xl mb-8 filter drop-shadow-[0_0_20px_rgba(255,105,180,0.8)]"
        >
          💖
        </motion.div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif italic mb-6 drop-shadow-lg text-white">
          Preparing something special for you{" "}
          <span className="font-sans font-bold not-italic bg-clip-text text-transparent bg-gradient-to-r from-[#9bafd9] via-[#c6b6d6] to-[#dfa6c4] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Her Name
          </span>
          <span className="text-pink-500 not-italic ml-3 drop-shadow-[0_0_15px_rgba(255,105,180,1)]">💖</span>
        </h1>

        <p className="text-xs md:text-sm tracking-[0.25em] text-[#d4b5cd] mb-14 uppercase font-medium">
          With Love &middot; Made just for you
        </p>

        {/* Progress Bar Container */}
        <div className="w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-md shadow-[0_0_10px_rgba(255,105,180,0.2)]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#dfa6c4] via-[#e87cb3] to-[#ff479c] rounded-full shadow-[0_0_10px_rgba(255,105,180,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>
      </div>

      {/* Bottom Floating Emojis */}
      <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex justify-between px-6 md:px-24 pointer-events-none">
        {bottomEmojis.map((emoji, index) => (
          <motion.div
            key={index}
            className="text-2xl md:text-4xl filter drop-shadow-[0_0_10px_rgba(255,105,180,0.6)]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: [0, -20, 0], 
              opacity: [0.5, 1, 0.5],
              rotate: [0, Math.random() * 30 - 15, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 2.5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
