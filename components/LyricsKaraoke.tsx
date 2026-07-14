import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

interface LyricLine {
  /** Start time in seconds. */
  start: number;
  /** End time in seconds. */
  end: number;
  /** The displayed lyric text. */
  text: string;
}

interface LyricsKaraokeProps {
  /** Current playback time from the audio player (seconds). */
  currentTime: number;
  /** Whether to show the "Continue" button. */
  showButton: boolean;
  /** Fires when the user clicks "Continue". */
  onContinue: () => void;
}

/**
 * Lyrics timestamps detected by Whisper AI from the actual audio waveform.
 * Each entry has a start time, end time, and the spoken/sung text.
 */
const LYRICS: LyricLine[] = [
  { start: 0.0, end: 1.88, text: "You know I can take care of myself." },
  { start: 3.68, end: 4.34, text: "Yeah, I know." },
  { start: 5.02, end: 5.84, text: "It's not for you." },
  { start: 6.92, end: 7.58, text: "It's for me." },
  { start: 8.86, end: 9.56, text: "For us." },
  {
    start: 11.26,
    end: 14.14,
    text: "You make me brave enough to admit that I want to be happy.",
  },
  { start: 15.94, end: 17.46, text: "And I want to be happy with you." },
  {
    start: 23.34,
    end: 25.08,
    text: "And I'm gonna pick up more catering shifts.",
  },
  { start: 26.66, end: 27.78, text: "And ask for a raise." },
  {
    start: 28.82,
    end: 31.5,
    text: "I'll find a serving job at an actual restaurant.",
  },
  {
    start: 32.94,
    end: 35.86,
    text: "And I won't say no to commercial auditions even though they're annoying.",
  },
  {
    start: 36.74,
    end: 38.6,
    text: "I'll make an actual effort to find a manager.",
  },
];

/** Colors for highlighted vs. unhighlighted words. */
const HIGHLIGHT_COLOR = "oklch(0.98 0.05 350)"; // Very light pink/white
const DIM_COLOR = "oklch(0.55 0.04 320)"; // Dimmer purple/pink
const HIGHLIGHT_SHADOW =
  "0 0 25px oklch(0.78 0.22 340 / 0.9), 0 0 50px oklch(0.65 0.22 320 / 0.6)";

/**
 * Karaoke-style lyric display that highlights words in sync
 * with the audio playback time.
 */
export function LyricsKaraoke({
  currentTime,
  showButton,
  onContinue,
}: LyricsKaraokeProps) {
  // Find the active lyric line based on current playback time
  const activeIndex = useMemo(() => {
    let index = 0;
    for (let i = 0; i < LYRICS.length; i++) {
      if (currentTime >= LYRICS[i].start) index = i;
    }
    return index;
  }, [currentTime]);

  const activeLine = LYRICS[activeIndex];
  const lineDuration = activeLine.end - activeLine.start;
  const lineProgress = Math.min(
    1,
    Math.max(0, (currentTime - activeLine.start) / lineDuration),
  );

  const words = activeLine.text.split(" ");
  const highlightedWordCount = Math.floor(lineProgress * words.length);

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center w-full">
      {/* Skip button in top corner */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onContinue}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50 text-xs sm:text-sm uppercase tracking-widest text-white/60 hover:text-white transition-colors backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10"
      >
        Skip ⏭
      </motion.button>

      {/* Now-playing label */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xs sm:text-sm uppercase tracking-[0.4em] text-white/60 mb-8"
      >
        ♪ Now playing · just for you ♪
      </motion.p>

      {/* Lyric line with word-by-word highlighting */}
      <div className="max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.h1
            key={activeIndex}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-x-3 gap-y-2 font-serif italic text-4xl sm:text-6xl md:text-7xl leading-tight text-white/80"
          >
            {words.map((word, wordIndex) => {
              const isHighlighted = wordIndex <= highlightedWordCount;
              const isCurrentWord = wordIndex === highlightedWordCount;

              return (
                <motion.span
                  key={wordIndex}
                  className="transition-all duration-200"
                  style={{
                    color: isHighlighted ? HIGHLIGHT_COLOR : DIM_COLOR,
                    textShadow: isHighlighted ? HIGHLIGHT_SHADOW : "none",
                    transform: isCurrentWord ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {word}
                </motion.span>
              );
            })}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Continue button — revealed after first audio cycle */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="mt-16 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-8 py-3 text-sm tracking-widest uppercase shadow-[0_0_15px_rgba(255,105,180,0.5)] hover:shadow-[0_0_25px_rgba(255,105,180,0.8)] transition-all text-white font-medium"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,105,180,0.2), rgba(255,182,193,0.3))",
            }}
          >
            Continue ✦
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
