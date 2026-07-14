"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import flowerAnimation from "../public/flowerlottie.json";
import LoadingScreen from "@/components/LoadingScreen";
import { LyricsKaraoke } from "@/components/LyricsKaraoke";
import { StarsBackground } from "@/components/StarsBackground";
import { ProposalScene } from "@/components/ProposalScene";
import { BookSurprise } from "@/components/BookSurprise";

export default function Home() {
  const [stage, setStage] = useState<"loading" | "karaoke" | "next" | "book">("loading");
  
  // Audio state
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.currentTime > 38.6) {
        setShowContinue(true);
      }
    }
  };

  const handleContinue = () => {
    setStage("next");
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#120322] via-[#350a3b] to-[#590d3a] text-white">
      {/* Persistent stars background */}
      <StarsBackground />

      {/* Cute Top-Left Lottie Decor */}
      <div className="fixed -top-[15%] left-0 w-[60vw] h-[100vh] z-0 pointer-events-none opacity-60">
        <Lottie animationData={flowerAnimation} loop={true} />
      </div>
      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <LoadingScreen key="loading" onComplete={() => setStage("karaoke")} />
        )}
        
        {stage === "karaoke" && (
          <motion.div 
            key="karaoke" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative z-10 w-full h-full flex flex-col items-center justify-center"
          >
            <LyricsKaraoke 
              currentTime={currentTime} 
              showButton={showContinue} 
              onContinue={handleContinue} 
            />
            
            <audio 
              ref={audioRef}
              src="/audio.mp3"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setShowContinue(true)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Custom play button at bottom right */}
            <button 
              onClick={handlePlay}
              className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 flex flex-col items-center gap-2 z-50 text-white/70 hover:text-white transition-all group"
            >
              <span className="text-[10px] sm:text-xs uppercase tracking-widest group-hover:text-pink-300 transition-colors">
                Click me to play ♪
              </span>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-white/30 flex items-center justify-center bg-black/20 backdrop-blur-sm group-hover:bg-white/10 group-hover:border-pink-300 transition-all group-hover:scale-105 shadow-[0_0_15px_rgba(255,105,180,0)] group-hover:shadow-[0_0_15px_rgba(255,105,180,0.5)]">
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                )}
              </div>
            </button>
          </motion.div>
        )}

        {stage === "next" && (
          <motion.div 
            key="next" 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative z-10 w-full h-full flex flex-col items-center justify-center"
          >
            <ProposalScene onUnbox={() => setStage("book")} />
          </motion.div>
        )}

        {stage === "book" && (
          <motion.div 
            key="book" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative z-10 w-full h-full flex flex-col items-center justify-center"
          >
            <BookSurprise />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
