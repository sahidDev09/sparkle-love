"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const TYPEWRITER_TEXT = "I promise it'll be the best day ever 🌸";
const TYPEWRITER_SPEED_MS = 60;
const CELEBRATION_EMOJIS = ["🌸", "💖", "🥹", "🐻", "💌", "✨"];
const ACTIVITIES = ["Cha date", "Rickshaw ride", "Sing together", "Fighting", "Travel date", "Street food", "Movie Date", "Bike Ride"];

const FLOATING_MEMES = [
  { text: "🐱 Cha date ?", top: "15%", left: "15%" },
  { text: "👩‍🦰 ami toh ready", top: "10%", left: "45%" },
  { text: "🌸 bloom for u", top: "20%", left: "80%" },
  { text: "🥺 Late night walk ?", top: "45%", left: "85%" },
  { text: "✨ Cholo Kashmir ?", top: "80%", left: "80%" },
  { text: "🐻 bear hug", top: "90%", left: "45%" },
  { text: "💌 Tong dukaner cha ?", top: "85%", left: "10%" },
  { text: "🤭 Wanna go rickshaw ride with you~", top: "55%", left: "8%" },
];

interface ProposalSceneProps {
  onUnbox?: () => void;
}

export function ProposalScene({ onUnbox }: ProposalSceneProps) {
  const [accepted, setAccepted] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [dateSubmittedMessage, setDateSubmittedMessage] = useState("");
  
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

  // Surprise Timer & Modal State
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);

  // Calendar logic
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = today.toLocaleString('default', { month: 'long' });

  // Typewriter animation
  useEffect(() => {
    let charIndex = 0;
    const intervalId = setInterval(() => {
      charIndex++;
      setTypedText(TYPEWRITER_TEXT.slice(0, charIndex));
      if (charIndex >= TYPEWRITER_TEXT.length) clearInterval(intervalId);
    }, TYPEWRITER_SPEED_MS);
    return () => clearInterval(intervalId);
  }, []);

  // Surprise Countdown Effect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (countdown === 0) {
      setShowSurpriseModal(true);
    }
  }, [countdown]);

  const handleNoHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (typeof window === 'undefined') return;

    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // We want the button to stay within these absolute screen coordinates (with a 20px safety margin)
    const minAbsX = 20;
    const maxAbsX = vw - rect.width - 20;
    const minAbsY = 20;
    const maxAbsY = vh - rect.height - 20;

    // Calculate the button's original, un-translated layout position
    const originalAbsX = rect.left - noPosition.x;
    const originalAbsY = rect.top - noPosition.y;

    let newAbsX = rect.left;
    let newAbsY = rect.top;

    // Generate random absolute positions until it's at least 100px away from the current position
    for (let attempts = 0; attempts < 10; attempts++) {
      const randX = Math.random() * (maxAbsX - minAbsX) + minAbsX;
      const randY = Math.random() * (maxAbsY - minAbsY) + minAbsY;

      const distance = Math.sqrt(Math.pow(randX - rect.left, 2) + Math.pow(randY - rect.top, 2));
      
      if (distance > 100) {
        newAbsX = randX;
        newAbsY = randY;
        break;
      }
    }

    // Set the new translation based on the original layout position
    setNoPosition({
      x: newAbsX - originalAbsX,
      y: newAbsY - originalAbsY,
    });
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
    );
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedActivities.length < 3) {
      alert("Please pick at least 3 things to do! 🥺");
      return;
    }
    if (!selectedDate) {
      alert("Please select a date for our date! 📅");
      return;
    }
    setDateSubmittedMessage("Yay! I can't wait for our date! 🥰");



    setTimeout(() => {
      setShowDateDialog(false);
      setAccepted(true);
      setCountdown(5); // Start the 5 second countdown!
    }, 2500);
  };

  return (
    <div className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 text-center text-white">
      
      {/* Party Popper Fullscreen Lottie */}
      {accepted && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-screen">
          <DotLottieReact
            src="https://lottie.host/ac53c107-e5c5-4fb1-a45b-cc8d6fa0d354/5Aq62O0Agb.lottie"
            loop={false}
            autoplay
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Floating Corner Timer */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-md border border-pink-300/30 rounded-full px-5 py-2 text-pink-200 font-bold shadow-[0_0_15px_rgba(255,105,180,0.3)] tracking-wider"
          >
            Wait... {countdown}s
          </motion.div>
        )}
      </AnimatePresence>

      {/* Surprise Final Modal */}
      <AnimatePresence>
        {showSurpriseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-md bg-[#1d0a27] backdrop-blur-xl border border-pink-500/30 rounded-3xl p-8 sm:p-10 text-center shadow-[0_0_50px_rgba(255,105,180,0.3)]"
            >
              <div className="text-6xl mb-4 drop-shadow-md">🎁</div>
              <h3 className="font-serif italic text-2xl sm:text-3xl text-pink-200 mb-4 drop-shadow-md">
                A Little Something...
              </h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8">
                Since we are officially made for each other, I want to give you something special. Here is a surprise just for you! ✨
              </p>
              
              <button
                onClick={() => {
                  if (onUnbox) onUnbox();
                }}
                className="w-full rounded-full px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_15px_rgba(255,105,180,0.4)] hover:shadow-[0_0_25px_rgba(255,105,180,0.7)] transition-all hover:scale-105"
              >
                Unbox Surprise 🎀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Date Dialog Modal Overlay */}
      <AnimatePresence>
        {showDateDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-10 text-center shadow-[0_0_40px_rgba(255,105,180,0.3)]"
            >
              {dateSubmittedMessage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="text-6xl mb-2">🥰</div>
                  <h3 className="text-2xl font-serif italic font-bold text-pink-200">
                    {dateSubmittedMessage}
                  </h3>
                  <p className="text-white/60 text-sm">Locking it in...</p>
                </motion.div>
              ) : (
                <form onSubmit={handleDateSubmit} className="flex flex-col gap-6 text-left">
                  <h3 className="font-serif italic text-3xl text-center text-pink-200 mb-2 drop-shadow-md">
                    Plan Our Date 🗓️
                  </h3>
                  
                  <div className="flex flex-col gap-6">
                    {/* Animated Custom Date Picker */}
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-sm font-semibold text-white/90 ml-1">When are we going?</label>
                      <button
                        type="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className={`w-full flex items-center justify-between bg-white/10 border rounded-xl px-4 py-3 text-left transition-colors ${showCalendar ? 'border-pink-400' : 'border-white/20 hover:bg-white/20'}`}
                      >
                        <span className={selectedDate ? "text-white" : "text-white/50"}>
                          {selectedDate ? selectedDate : "Select a beautiful day..."}
                        </span>
                        <span className="text-white/70">📅</span>
                      </button>
                      
                      <AnimatePresence>
                        {showCalendar && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute top-[100%] left-0 w-full z-10 bg-[#350a3b]/95 backdrop-blur-xl border border-pink-500/30 rounded-xl mt-2 p-4 shadow-xl overflow-hidden"
                          >
                            <div className="text-center font-serif text-pink-200 mb-3 font-semibold">
                              {monthName} {year}
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-white/50 font-medium">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                              {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${monthName} ${day}, ${year}`;
                                const isSelected = selectedDate === dateStr;
                                return (
                                  <motion.button
                                    type="button"
                                    key={day}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setSelectedDate(dateStr); setShowCalendar(false); }}
                                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm transition-all ${
                                      isSelected 
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_10px_rgba(255,105,180,0.8)] font-bold' 
                                        : 'text-white/90 hover:bg-white/20'
                                    }`}
                                  >
                                    {day}
                                  </motion.button>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Custom Rounded Checkboxes */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-white/90 ml-1">What are we doing? (pick 3)</label>
                      <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                        {ACTIVITIES.map(activity => {
                          const isChecked = selectedActivities.includes(activity);
                          return (
                            <label key={activity} className="flex items-center gap-3 text-sm text-white/80 cursor-pointer hover:text-white transition-colors group">
                              <input 
                                type="checkbox"
                                className="hidden"
                                checked={isChecked}
                                onChange={() => toggleActivity(activity)}
                              />
                              <div className={`w-5 h-5 flex-shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-gradient-to-br from-pink-500 to-purple-500 border-transparent shadow-[0_0_8px_rgba(255,105,180,0.6)]' : 'border-white/30 group-hover:border-pink-300'}`}>
                                <AnimatePresence>
                                  {isChecked && (
                                    <motion.svg 
                                      initial={{ scale: 0, opacity: 0 }} 
                                      animate={{ scale: 1, opacity: 1 }} 
                                      exit={{ scale: 0, opacity: 0 }}
                                      className="w-3 h-3 text-white drop-shadow-md" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </motion.svg>
                                  )}
                                </AnimatePresence>
                              </div>
                              <span className={isChecked ? "font-medium text-pink-100" : ""}>{activity}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full px-8 py-4 mt-2 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_15px_rgba(255,105,180,0.4)] hover:shadow-[0_0_25px_rgba(255,105,180,0.7)] transition-all hover:scale-105"
                  >
                    Confirm Date 💖
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Memes Background */}
      {!accepted && !showDateDialog && FLOATING_MEMES.map((meme, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm whitespace-nowrap text-white/80"
          style={{ top: meme.top, left: meme.left }}
          animate={{ y: [0, -10, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
        >
          {meme.text}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-2xl w-full flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          {!accepted && (
            <motion.div
              key="question-text"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full"
            >
              <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-white/60 mb-6">
                one tiny question for you ✦
              </p>

              <motion.h1
                animate={{
                  textShadow: [
                    "0 0 15px rgba(255,105,180,0.4)",
                    "0 0 30px rgba(255,105,180,0.7)",
                    "0 0 15px rgba(255,105,180,0.4)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="font-serif italic text-5xl sm:text-7xl md:text-8xl text-pink-100 drop-shadow-md text-center"
              >
                Let's go on a date?
              </motion.h1>

              <p className="mt-6 text-lg sm:text-xl text-white/80 min-h-[2em] font-medium text-center">
                {typedText}
                <span className="inline-block w-[2px] h-5 bg-pink-400 align-middle ml-1 animate-pulse" />
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        {!accepted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <div className="flex items-center justify-center gap-6 relative">
              <button
                onClick={() => setShowDateDialog(true)}
                className="relative rounded-full px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_20px_rgba(255,105,180,0.6)] hover:shadow-[0_0_30px_rgba(255,105,180,0.9)] hover:scale-105 transition-all"
              >
                Cholo 💖
              </button>

              <motion.button
                onMouseEnter={handleNoHover}
                onClick={handleNoHover}
                animate={{ x: noPosition.x, y: noPosition.y }}
                className="relative rounded-full px-10 py-4 text-lg font-semibold bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
              >
                No 😶
              </motion.button>
            </div>

            <span className="text-xs text-white/50 italic mt-2">
              (try clicking "No" if you dare)
            </span>
          </motion.div>
        )}

        {/* Acceptance celebration */}
        <AnimatePresence>
          {accepted && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="mt-20 w-full"
            >
              <div className="bg-white/10 backdrop-blur-md border border-pink-300/30 rounded-3xl p-8 sm:p-10 max-w-xl mx-auto shadow-[0_0_30px_rgba(255,105,180,0.3)] flex flex-col items-center">
                <div className="w-72 h-72 sm:w-[400px] sm:h-[400px] -mt-36 drop-shadow-[0_0_25px_rgba(255,105,180,0.5)]">
                  <DotLottieReact
                    src="https://lottie.host/37c7eb7d-ac47-44a6-82e3-c391c4d2f6c3/6BL5jU14vd.lottie"
                    loop
                    autoplay
                  />
                </div>
                <h2 className="font-serif italic text-3xl sm:text-5xl text-pink-200 mb-4 drop-shadow-[0_0_10px_rgba(255,105,180,0.8)] -mt-4">
                  Yayyyy!
                </h2>
                <p className="mt-3 text-white/90 text-xl font-medium text-center">
                  Now you're officially stuck with me 😌💞
                </p>
                <p className="mt-2 text-sm text-pink-300/70 tracking-widest uppercase">
                  no take backs · forever booked · vibes locked in
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-4xl">
                  {CELEBRATION_EMOJIS.map((emoji, index) => (
                    <motion.span
                      key={emoji}
                      animate={{ y: [0, -15, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.15,
                        ease: "easeInOut"
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
