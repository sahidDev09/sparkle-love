"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import coupleAnimationData from "../public/couple.json";
import dynamic from "next/dynamic";

// Dynamically import HTMLFlipBook to avoid SSR issues (it uses DOM APIs)
const HTMLFlipBook = dynamic(() => import("react-pageflip").then((mod) => mod.default), {
  ssr: false,
});

const COVER_IMAGE = "https://i.postimg.cc/LXdH1q9x/AI-Time-Traveller-Artist-Shows-How-Iconic-People-From-The-Past-Would-Take-Their-Selfies-(28-Pics).jpg";
const FIRST_CONVERSATION_IMAGE = "https://i.postimg.cc/Jnw1kyrd/Beautiful-Natural-Smile-Aesthetic-Portrait-Soft-Girl-Nature-Photography-Ai-Art.jpg";
const MY_AVATAR = "https://picsum.photos/100/100?random=12";
const HER_AVATAR = "https://i.postimg.cc/RFrMH3SX/Girlyy.jpg";

const CHAT_MESSAGES = [
  { from: "me", text: "Hey! You have an amazing smile 😊" },
  { from: "her", text: "Aw, thank you! That's so sweet of you to say 💖" },
  { from: "me", text: "I just couldn't scroll past without saying it. How's your day going?" },
  { from: "her", text: "It's going great, especially now! ✨" },
];

const PAGES = [
  {
    type: "chat",
    title: "How It All Started",
    image: "https://i.postimg.cc/RFrMH3SX/Girlyy.jpg",
    text: "It started with a simple notification, but it quickly became the highlight of my day. Your words brought so much warmth, and I found myself smiling at my screen like an absolute fool.",
  },
  {
    type: "normal",
    title: "A Radiant Light",
    image: "https://i.postimg.cc/1tx9qgmj/image.jpg",
    text: "Every time you smile, the world gets a little brighter. It's like nature itself pauses to admire the pure, effortless beauty you carry wherever you go.",
  },
  {
    type: "normal",
    title: "Endless Grace",
    image: "https://i.postimg.cc/N02sF8cy/image.jpg",
    text: "You have this incredible way of making everything feel magical. Your kindness, your spirit, and your beautiful heart are the reasons I find myself falling more every single day.",
  },
  {
    type: "normal",
    title: "Cherished Moments",
    image: "https://i.postimg.cc/Jnw1kyrd/Beautiful-Natural-Smile-Aesthetic-Portrait-Soft-Girl-Nature-Photography-Ai-Art.jpg",
    text: "With you, even the quietest moments are filled with joy. I cherish every laugh we share and every memory we create together. You are truly something special.",
  },
  {
    type: "poem",
    title: "A Masterpiece",
    image: "https://i.postimg.cc/LXdH1q9x/AI-Time-Traveller-Artist-Shows-How-Iconic-People-From-The-Past-Would-Take-Their-Selfies-(28-Pics).jpg",
    text: "In your eyes, a universe unfolds,\nA story of beauty, gracefully told.\nWith every smile, you light the way,\nMaking a masterpiece of every day.",
  },
];

// ─── Page Components using forwardRef (required by react-pageflip) ───

const CoverPage = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-2xl" data-density="hard">
      <img src={COVER_IMAGE} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif italic text-3xl sm:text-5xl text-white drop-shadow-[0_0_20px_rgba(255,105,180,0.6)] mb-4">
          Our Story
        </h1>
        <p className="text-white/70 text-sm tracking-widest uppercase">tap to open →</p>
      </div>
    </div>
  );
});
CoverPage.displayName = "CoverPage";

const ImagePage = React.forwardRef<HTMLDivElement, { image: string }>(({ image }, ref) => {
  return (
    <div ref={ref} className="relative w-full h-full bg-[#fffcf8] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 p-4 sm:p-6">
        <div className="w-full h-full border-2 border-dashed border-pink-100 rounded-xl p-3 overflow-hidden">
          <img
            src={image}
            alt="Memory"
            className="w-full h-full object-cover rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
});
ImagePage.displayName = "ImagePage";

const ChatPage = React.forwardRef<HTMLDivElement, { page: typeof PAGES[0] }>(({ page }, ref) => {
  return (
    <div ref={ref} className="relative w-full h-full bg-[#fffcf8] overflow-hidden rounded-2xl">
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-6">
        <h2 className="font-display text-2xl sm:text-3xl text-pink-500 mb-4 italic flex-shrink-0">
          {page.title}
        </h2>
        <div className="flex-1 w-full px-1 flex flex-col items-center justify-start gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full flex justify-center mb-2">
            <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Jun 23 at 12:09 AM
            </span>
          </div>
          <div className="w-full flex flex-col gap-3 mb-3">
            {CHAT_MESSAGES.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.from === "me" ? "flex-row-reverse" : "flex-row"}`}>
                <img src={msg.from === "me" ? MY_AVATAR : HER_AVATAR} alt={msg.from === "me" ? "Me" : "Her"} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-pink-300 flex-shrink-0" />
                <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm sm:text-base shadow-sm ${msg.from === "me" ? "bg-indigo-500 text-white rounded-br-sm text-right" : "bg-pink-100 text-gray-800 rounded-bl-sm text-left"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="text-gray-600 font-serif text-sm sm:text-base leading-relaxed px-2 border-t border-pink-100 pt-2 text-left">
            <p>{page.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
});
ChatPage.displayName = "ChatPage";

const ContentPage = React.forwardRef<HTMLDivElement, { page: typeof PAGES[0]; isLast: boolean }>(({ page, isLast }, ref) => {
  return (
    <div ref={ref} className="relative w-full h-full bg-[#fffcf8] overflow-hidden rounded-2xl">
      <div
        className="w-full h-full flex flex-col justify-center items-center relative overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          background: `
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 31px,
              rgba(184, 212, 227, 0.4) 31px,
              rgba(184, 212, 227, 0.4) 32px
            )
          `,
          backgroundSize: "100% 100%",
          backgroundColor: "#fbf9f1",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.04)",
        }}
      >
        {/* Spiral binding holes */}
        <div className="absolute left-[14px] top-0 bottom-0 flex flex-col items-center justify-around py-8 pointer-events-none z-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-[10px] h-[10px] rounded-full bg-[#fbf9f1] border-2 border-gray-300"
              style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)" }}
            />
          ))}
        </div>

        <h2 className="font-display text-xl sm:text-2xl text-pink-500 italic text-center pt-8 pb-4 px-6 z-20">
          {page.title}
        </h2>
        <div
          className={`text-gray-700 px-8 text-center z-20 pb-8 ${page.type === "poem" ? "text-[13px] sm:text-[17px]" : "text-[14px] sm:text-[17px]"}`}
          style={{
            whiteSpace: "pre-line",
            fontFamily: "Georgia, serif",
            lineHeight: page.type === "poem" ? "24px" : "36px",
            color: "#2c3e6b",
            letterSpacing: "0.3px",
          }}
        >
          <p>{page.text}</p>
        </div>
      </div>
    </div>
  );
});
ContentPage.displayName = "ContentPage";

const EndPage = React.forwardRef<HTMLDivElement, { onClose: () => void }>(({ onClose }, ref) => {
  return (
    <div ref={ref} className="relative w-full h-full bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3] overflow-hidden rounded-2xl" data-density="hard">
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 sm:p-8">
        <div className="text-6xl mb-6">💕</div>
        <h2 className="font-serif italic text-2xl sm:text-3xl text-pink-600 mb-4">
          The End... for now
        </h2>
        <p className="text-pink-500/70 text-sm sm:text-base leading-relaxed mb-8 max-w-xs" style={{ fontFamily: "Georgia, serif" }}>
          Every chapter with you is my favorite. Can&apos;t wait for the next one.
        </p>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-sm sm:text-base font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Close Book 📕
        </button>
      </div>
    </div>
  );
});
EndPage.displayName = "EndPage";

// ─── Main BookSurprise Component ───

export function BookSurprise() {
  const [isMuted, setIsMuted] = useState(false);
  const [showClosingScreen, setShowClosingScreen] = useState(false);
  const [bookReady, setBookReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bookRef = useRef<any>(null);

  // Total page count: cover + (image+content for each PAGES entry) + end page
  const totalPages = 2 + PAGES.length * 2;

  // Sparkles setup
  const sparkles = useMemo(
    () =>
      [...Array(30)].map(() => ({
        width: Math.random() * 4 + 1,
        height: Math.random() * 4 + 1,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 3,
      })),
    []
  );

  // Mount book after hydration
  useEffect(() => {
    setBookReady(true);
  }, []);

  // Handle audio
  useEffect(() => {
    const audio = new Audio("/loveSong.mp3");
    audio.volume = 0.3;
    audio.currentTime = 20;
    audio.loop = true;
    audioRef.current = audio;
    audio.play().catch(() => console.log("Audio waiting for interaction..."));
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleCloseBook = useCallback(() => {
    setShowClosingScreen(true);
  }, []);

  const handleSecretRedirect = () => {
    window.location.href = "/hidden-secret";
  };

  const handleFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const flipNext = useCallback(() => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  }, []);

  const flipPrev = useCallback(() => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  }, []);

  return (
    <div className="relative z-20 min-h-[100dvh] w-full flex items-center justify-center p-4 overflow-hidden">

      {/* Mute button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-[100] bg-white/10 backdrop-blur-md px-4 py-2 text-lg hover:bg-white/20 transition-colors rounded-full"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* Navigation buttons */}
      {bookReady && !showClosingScreen && (
        <div className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center gap-4">
          {currentPage > 0 && (
            <button
              onClick={flipPrev}
              className="px-6 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all shadow-lg border border-white/20"
            >
              ← Previous
            </button>
          )}
          {currentPage < totalPages - 1 && (
            <button
              onClick={flipNext}
              className="px-6 py-2.5 bg-pink-500/80 backdrop-blur-md text-white rounded-full text-sm font-medium hover:bg-pink-500 transition-all shadow-lg border border-pink-400/30"
            >
              Next →
            </button>
          )}
        </div>
      )}

      {/* The Flip Book */}
      {bookReady && !showClosingScreen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center w-full h-[100dvh]"
          style={{ transform: currentPage === 0 ? "translateX(-210px)" : "translateX(0px)", transition: "transform 0.6s ease" }}
        >
          {/* @ts-ignore - dynamic import types */}
          <HTMLFlipBook
            ref={bookRef}
            width={420}
            height={560}
            size="fixed"
            minWidth={420}
            maxWidth={420}
            minHeight={560}
            maxHeight={560}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handleFlip}
            className="book-shadow" style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePortrait={false}
            startZIndex={0}
            autoSize={false}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {/* Page 0: Front Cover */}
            <CoverPage key="cover" />

            {/* Flattened pages: image + content for each entry */}
            <ImagePage key="img-0" image={PAGES[0].image} />
            <ChatPage key="content-0" page={PAGES[0]} />

            <ImagePage key="img-1" image={PAGES[1].image} />
            <ContentPage key="content-1" page={PAGES[1]} isLast={false} />

            <ImagePage key="img-2" image={PAGES[2].image} />
            <ContentPage key="content-2" page={PAGES[2]} isLast={false} />

            <ImagePage key="img-3" image={PAGES[3].image} />
            <ContentPage key="content-3" page={PAGES[3]} isLast={false} />

            <ImagePage key="img-4" image={PAGES[4].image} />
            <ContentPage key="content-4" page={PAGES[4]} isLast={true} />

            {/* Final page: Close Book */}
            <EndPage key="end" onClose={handleCloseBook} />
          </HTMLFlipBook>
        </motion.div>
      )}

      {/* Closing Celebration Screen */}
      <AnimatePresence>
        {showClosingScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {sparkles.map((sparkle, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{ width: sparkle.width, height: sparkle.height, left: sparkle.left, top: sparkle.top }}
                  animate={{ opacity: [0.1, 1, 0.1], scale: [0.8, 1.4, 0.8] }}
                  transition={{ duration: sparkle.duration, repeat: Infinity, delay: sparkle.delay }}
                />
              ))}
            </div>

            <motion.div initial={{ scale: 0.5, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="w-64 h-64 sm:w-80 sm:h-80">
              <Lottie animationData={coupleAnimationData} loop={true} autoplay={true} style={{ width: "100%", height: "100%" }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8 }} className="mt-6 px-8 text-center max-w-sm sm:max-w-md">
              <div className="mb-3 text-3xl">✨</div>
              <p className="text-white/90 text-base sm:text-lg leading-relaxed font-light" style={{ fontFamily: "Georgia, serif" }}>
                This is just a beginning, something is cooking behind,{" "}
                <span className="text-pink-300 font-semibold">amazing stuff will be added soon</span>.
              </p>

              <div className="mt-6 flex justify-center gap-2">
                {["💕", "🌙", "💕"].map((emoji, i) => <span key={i} className="text-xl">{emoji}</span>)}
              </div>

              <motion.div className="mt-10 flex justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}>
                <button
                  onClick={handleSecretRedirect}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>✨</span>
                  <span>Open hidden secret</span>
                  <span>✨</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
