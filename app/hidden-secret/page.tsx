"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StarsBackground } from "@/components/StarsBackground";

// The Spotify Player component
function SecretMusicPlayer() {
  const router = useRouter();
  
  const songs = [
    { id: 1, title: "Kabhi alvida naa Kehna", artist: "Her Name", src: "/songs/Kabhi alvida naa Kehna.mp3", cover: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=300&h=300&auto=format&fit=crop" },
    { id: 2, title: "Main Agar Kahoon", artist: "Her Name", src: "/songs/Main Agar Kahoon.mp3", cover: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?q=80&w=300&h=300&auto=format&fit=crop" },
    { id: 3, title: "Meghomilone", artist: "Her Name", src: "/songs/Meghomilone.mp3", cover: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=300&h=300&auto=format&fit=crop" },
    { id: 4, title: "Ore nil doriya", artist: "Her Name", src: "/songs/Ore nil doriya .mp3", cover: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=300&h=300&auto=format&fit=crop" },
    { id: 5, title: "Shopner cheyeo modhur", artist: "Her Name", src: "/songs/Shopner cheyeo modhur.mp3", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=300&h=300&auto=format&fit=crop" },
    { id: 6, title: "Tor premete Ondho holam", artist: "Her Name", src: "/songs/Tor premete Ondho holam.mp3", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&h=300&auto=format&fit=crop" },
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  const currentSong = songs[currentSongIndex];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log(e));
      } else {
        audioRef.current.pause();
      }
      audioRef.current.volume = volume;
    }
  }, [currentSongIndex, isPlaying, volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  const handleEnded = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
  };

  return (
    <div className="z-10 w-full max-w-5xl bg-[#181818]/90 rounded-3xl backdrop-blur-2xl border border-white/5 shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-10 md:gap-16">
      <audio 
        ref={audioRef} 
        src={currentSong.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Left Side - Player Animation */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-8">
        <h2 className="text-2xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 self-start">
          Now Playing
        </h2>
        
        {/* Spinning Vinyl / Cover */}
        <div className={`relative w-64 h-64 md:w-72 md:h-72 rounded-full border-4 border-[#282828] shadow-[0_0_50px_rgba(236,72,153,0.15)] overflow-hidden transition-all duration-1000 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
          <img 
            src={currentSong.cover} 
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
          {/* Vinyl center hole */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#121212] rounded-full border-2 border-[#282828] flex items-center justify-center">
             <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
          </div>
        </div>

        <div className="text-center w-full">
          <h3 className="text-2xl font-bold text-white mb-2">{currentSong.title}</h3>
          <p className="text-pink-300/80 text-base">{currentSong.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-3 px-4">
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
             // Simple seek implementation
             if (audioRef.current) {
               const rect = e.currentTarget.getBoundingClientRect();
               const clickX = e.clientX - rect.left;
               const newProgress = (clickX / rect.width);
               audioRef.current.currentTime = newProgress * audioRef.current.duration;
             }
          }}>
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-150 relative"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex items-center justify-center gap-8">
            <button 
              onClick={() => setCurrentSongIndex((currentSongIndex - 1 + songs.length) % songs.length)}
              className="text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M19 20L9 12l10-8v16zM5 19h2V5H5v14z"></path></svg>
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 ml-1"><path d="M8 5v14l11-7z"></path></svg>
              )}
            </button>
            
            <button 
              onClick={handleEnded}
              className="text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M5 4l10 8-10 8V4zm12 0h2v16h-2V4z"></path></svg>
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 w-48 text-white/60">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Playlist */}
      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-8 mt-2">
            <h2 className="text-xl font-bold text-white tracking-wide">Our Playlist</h2>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded-full border border-white/20 text-xs text-white/70 hover:bg-white/10 hover:text-white uppercase tracking-wider transition-all"
            >
              Go Back
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {songs.map((song, idx) => (
              <div 
                key={song.id}
                onClick={() => playSong(idx)}
                className={`group flex items-center p-3 rounded-2xl cursor-pointer transition-all ${
                  currentSongIndex === idx 
                    ? 'bg-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden mr-4 flex-shrink-0 shadow-md">
                  <img src={song.cover} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  
                  {currentSongIndex === idx && isPlaying ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-pink-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className={`text-base font-medium truncate ${currentSongIndex === idx ? 'text-pink-300' : 'text-white/90'}`}>
                    {song.title}
                  </h4>
                  <p className="text-xs text-white/50 truncate mt-0.5">{song.artist}</p>
                </div>
                
                <div className="text-white/30 text-sm font-medium pr-2">
                  {currentSongIndex === idx ? (
                     <div className="flex gap-1 items-end h-4">
                        <div className="w-1 bg-pink-400 animate-[bounce_1s_infinite] h-2"></div>
                        <div className="w-1 bg-pink-400 animate-[bounce_1.2s_infinite] h-4"></div>
                        <div className="w-1 bg-pink-400 animate-[bounce_0.8s_infinite] h-3"></div>
                     </div>
                  ) : (
                    <span>0{idx + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional romantic text */}
        <div className="mt-12 text-center text-sm text-pink-200/60 italic font-serif">
          "Every love song reminds me of you."
        </div>
      </div>
    </div>
  );
}

export default function HiddenSecretPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (unlocked) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#120322] via-[#350a3b] to-[#590d3a] text-white flex flex-col items-center justify-center p-4">
        <StarsBackground />
        
        {/* Decorative blur elements for the background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-600/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full"></div>
        </div>

        <SecretMusicPlayer />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#120322] via-[#350a3b] to-[#590d3a] text-white flex flex-col items-center justify-center p-4">
      <StarsBackground />
      <div className="z-10 w-full max-w-md bg-[#2a082e]/60 p-8 md:p-10 rounded-[2rem] backdrop-blur-xl border border-pink-500/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative">
        
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)] border border-pink-300/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 -rotate-45 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        <div className="mt-8 text-center mb-8 space-y-3">
          <h1 className="text-3xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-300">
            A Secret Chapter
          </h1>
          <p className="text-pink-200/70 text-sm font-light">
            Only the key to my heart can unlock this page. Enter our special word below.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${error ? 'text-red-400' : 'text-pink-300/50'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
              </svg>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter the secret key..."
              className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/20 border ${error ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20' : 'border-pink-500/20 focus:border-pink-400 focus:ring-pink-400/20'} text-white placeholder:text-pink-100/30 focus:outline-none focus:ring-4 transition-all font-light tracking-widest`}
              autoFocus
            />
            {error && (
              <p className="absolute -bottom-6 left-2 text-[11px] text-red-300 font-medium tracking-wide flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                That's not it, my love. Try again.
              </p>
            )}
          </div>
          
          <button 
            type="submit"
            className="mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all shadow-[0_4px_15px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_25px_rgba(236,72,153,0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            Unlock My Heart
          </button>
        </form>
        
        <button 
          onClick={() => router.push('/')}
          className="mt-8 w-full text-center text-xs text-pink-200/40 hover:text-pink-200/80 transition-colors uppercase tracking-widest"
        >
          Return to home
        </button>
      </div>
    </main>
  );
}
