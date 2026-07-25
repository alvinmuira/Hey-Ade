import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Full lyrics for "The One That Got Away" by Katy Perry
const LYRIC_TIMESTAMPS = [
  // --- VERSE 1 ---
  { time: 0, text: "Summer after high school, when we first met..." },
  { time: 6, text: "We'd make out in your Mustang to Radiohead 🎶" },
  { time: 10, text: "And on my eighteenth birthday, we got matching tattoos ✨" },
  { time: 17, text: "Used to steal your parents' liquor and climb to the roof 🌌" },
  { time: 21, text: "Talked about our future like we had a clue..." },
  { time: 25, text: "Never planned that one day, I'd be losing you..." },

  // --- CHORUS 1 ---
  { time: 30, text: "In another life, I would be your girl 💖" },
  { time: 37, text: "We'd keep all our promises, be us against the world..." },
  { time: 45, text: "In another life, I would make you stay..." },
  { time: 51, text: "So I don't have to say you were..." },
  { time: 55, text: "The one that got away 💕" },
  { time: 59, text: "The one that got away..." },

  // --- VERSE 2 ---
  { time: 62, text: "I was June, and you were my Johnny Cash 🎸" },
  { time: 66, text: "Never one without the other, we made a pact..." },
  { time: 70, text: "Sometimes when I miss you, I put those records on 🎧" },
  { time: 77, text: "Someone said you had your tattoo removed..." },
  { time: 80, text: "Saw you downtown, singing the blues..." },
  { time: 84, text: "It's time to face the music, I'm no longer your muse..." },

  // --- CHORUS 2 ---
  { time: 90, text: "In another life, I would be your girl 💖" },
  { time: 97, text: "We'd keep all our promises, be us against the world..." },
  { time: 104, text: "In another life, I would make you stay..." },
  { time: 111, text: "So I don't have to say you were..." },
  { time: 114, text: "The one that got away 💕" },
  { time: 118, text: "The one that got away..." },

  // --- POST-CHORUS ---
  { time: 121, text: "The one... The one...The one..." },
  { time: 131, text: "The one that got away ✨" },

  // --- BRIDGE ---
  { time: 136, text: "All this money can't buy me a time machine, NOO ⏳" },
  { time: 143, text: "Can't replace you with a million rings, NOO 💍" },
  { time: 150, text: "I should've told you what you meant to me...Woooaahh" },
  { time: 157, text: "'Cause now I pay the price..." },

  // --- FINAL CHORUS & OUTRO ---
  { time: 161, text: "In another life, I would be your girl 💖" },
  { time: 168, text: "We'd keep all our promises, be us against the world..." },
  { time: 175, text: "In another life, I would make you stay..." },
  { time: 182, text: "So I don't have to say you were..." },
  { time: 185, text: "The one that got away 💕" },
  { time: 189, text: "The one that got away..." },
  { time: 193, text: "UUoooohh...UUoooohh...UUooooohh..." },
  { time: 204, text: "In another life, I would make you stay..." },
  { time: 211, text: "So I don't have to say you were the one that got away 🥹" },
  { time: 218, text: "The one that got away 💕" },
  { time: 223, text: "I love you Adelaide, Always" }
];

export default function Stage3NoteCards() {
  const audioRef = useRef(null);

  const [showLyrics, setShowLyrics] = useState(false);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSongEnded, setIsSongEnded] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Live Relationship Counter since March 31, 9:00 PM
  useEffect(() => {
    const now = new Date();
    let startYear = now.getFullYear();
    let startDate = new Date(startYear, 2, 31, 21, 0, 0);

    if (now < startDate) {
      startDate = new Date(startYear - 1, 2, 31, 21, 0, 0);
    }

    const updateCounter = () => {
      const current = new Date();
      const diff = current - startDate;

      setTimeElapsed({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentAudioTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleStartMusic = () => {
    setShowLyrics(true);
    setIsSongEnded(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log(err));
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRestartTrack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      setIsSongEnded(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setIsSongEnded(true);
  };

  const handleReloadWebsite = () => {
    window.location.reload();
  };

  // Identify Active Lyric Index & Next Lyric Index
  const activeLyricIdx = LYRIC_TIMESTAMPS.reduce((activeIdx, item, idx) => {
    return currentAudioTime >= item.time ? idx : activeIdx;
  }, 0);

  const activeLyric = LYRIC_TIMESTAMPS[activeLyricIdx];
  const nextLyric = LYRIC_TIMESTAMPS[activeLyricIdx + 1];

  const progressPercent = duration ? (currentAudioTime / duration) * 100 : 0;

  return (
    <div className="relative w-full h-[100dvh] bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950 text-white flex flex-col items-center justify-between p-6 overflow-hidden font-sans">
      
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/assets/song1.mp3"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {/* Ambient Glow */}
      <div className="absolute w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Relationship Counter Header */}
      <AnimatePresence>
        {showLyrics && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-20 text-center mt-2 w-full max-w-sm bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl"
          >
            <span className="text-[10px] uppercase tracking-widest text-rose-300 font-bold">
              Time Since We started talking (March 31, 9:00 PM) 
            </span>

            <div className="grid grid-cols-4 gap-2 mt-2 text-center">
              <div className="bg-black/30 rounded-lg p-2">
                <span className="text-lg font-black text-rose-200">{timeElapsed.days}</span>
                <p className="text-[9px] text-rose-100/60 font-medium">DAYS</p>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <span className="text-lg font-black text-rose-200">{timeElapsed.hours}</span>
                <p className="text-[9px] text-rose-100/60 font-medium">HRS</p>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <span className="text-lg font-black text-rose-200">{timeElapsed.minutes}</span>
                <p className="text-[9px] text-rose-100/60 font-medium">MINS</p>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <span className="text-lg font-black text-rose-200">{timeElapsed.seconds}</span>
                <p className="text-[9px] text-rose-100/60 font-medium">SECS</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Display Area */}
      <div className="relative z-10 w-full max-w-sm my-auto flex flex-col items-center justify-center min-h-[300px]">
        <AnimatePresence mode="wait">
          {!showLyrics ? (
            /* STEP 1: Vintage Burnt-Parchment Scroll Letter with Cursive Script & Heart Wax Seal */
            <motion.div
              key="personal-letter"
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative w-full p-6 text-amber-950 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-amber-900/40 flex flex-col items-center"
              style={{
                // Parchment paper gradient
                background: 'radial-gradient(ellipse at center, #f5e4bc 0%, #e2c992 70%, #bd9853 100%)',
                // Singed / Burnt dark border edge effect
                boxShadow: 'inset 0 0 35px rgba(60, 25, 0, 0.75), 0 20px 50px rgba(0,0,0,0.9)',
              }}
            >
              {/* Center Fold Line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-amber-900/20 shadow-[0_0_8px_rgba(0,0,0,0.3)] pointer-events-none" />

              {/* Red Heart Wax Seal (Bottom Right Positioned matching image) */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-red-900 via-rose-700 to-red-600 border-2 border-red-950 shadow-[0_4px_12px_rgba(0,0,0,0.6)] cursor-pointer rotate-12">
                <span className="text-red-200 text-base drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">❤️</span>
              </div>

              {/* Title Header */}
              <h2
                className="text-3xl text-amber-950 tracking-wider mb-3 font-bold"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                To My Adelaide
              </h2>

              {/* Handwritten Letter Body */}
              <div className="w-full px-2 py-1 mb-6 relative z-10 text-left">
                <p
                  className="text-lg text-amber-950/90 leading-relaxed tracking-wide"
                  style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 500 }}
                >
                  "Hey baby, &nbsp; So umm probably been a while since I wrote a paragraph for my lovely girl, well im gonna try.
For the past couple of days we haven’t talked that much like we used to and im glad that I don’t worry much but still I feel the love as you have kept on reassuring me. I wanna do the same for you love, I like you and I will forever love you, im obsessed with you girl and Adelaide though we may not be currently physically together receive my virtual kisses love 😘 😘. I may not write much today, just wanted to remind you, I love you Adelaide"
                </p>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartMusic}
                className="relative z-10 w-full py-3 px-6 rounded-full bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-100 font-serif text-sm shadow-xl border border-amber-600/40 cursor-pointer"
              >
                Play a Song 
              </motion.button>
            </motion.div>
          ) : (
            /* STEP 2: Focused 2-Line Stack (Current Centered + Next Preview Below) */
            <div className="w-full flex flex-col items-center justify-center gap-4 py-4">
              
              {/* CURRENT ACTIVE LYRIC */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`active-${activeLyricIdx}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full rounded-2xl px-6 py-5 text-center bg-white/15 backdrop-blur-xl border border-rose-300/60 shadow-[0_10px_35px_rgba(244,63,94,0.3)]"
                >
                  <p className="text-base sm:text-lg text-white font-semibold leading-relaxed break-words tracking-wide drop-shadow-md">
                    "{activeLyric?.text}"
                  </p>
                  
                </motion.div>
              </AnimatePresence>

              {/* NEXT UPCOMING LYRIC PREVIEW */}
              <AnimatePresence mode="wait">
                {nextLyric && (
                  <motion.div
                    key={`next-${activeLyricIdx + 1}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 0.45, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-full max-w-[92%] rounded-xl px-4 py-3 text-center bg-white/5 backdrop-blur-md border border-white/5"
                  >
                    <p className="text-xs text-rose-100/70 font-normal leading-relaxed break-words tracking-wide">
                      "{nextLyric.text}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Sleek, Modern Glass Control Bar */}
      {showLyrics && (
        <div className="relative z-20 w-full max-w-sm flex flex-col items-center gap-3 mb-2">
          
          <div className="w-full bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 px-5 py-3 flex items-center justify-between gap-4 shadow-2xl">
            
            {/* Modern Glass Play / Pause Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={togglePlayPause}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/40 border border-rose-300/40 cursor-pointer active:opacity-90"
            >
              {isPlaying ? (
                <div className="flex gap-1.5 items-center justify-center">
                  <span className="w-1.5 h-4 bg-white rounded-full shadow-sm" />
                  <span className="w-1.5 h-4 bg-white rounded-full shadow-sm" />
                </div>
              ) : (
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5" />
              )}
            </motion.button>

            {/* Minimal Waveform Equalizer Progress Display */}
            <div className="flex-1 flex items-center justify-center gap-1 h-6">
              {Array.from({ length: 22 }).map((_, i) => {
                const barProgress = (i / 22) * 100;
                const isPassed = progressPercent >= barProgress;

                const waveHeight = [35, 55, 80, 45, 90, 65, 40, 75, 100, 60, 85, 50, 70, 95, 40, 80, 60, 45, 85, 65, 40, 50][i % 22];

                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPassed
                        ? 'bg-gradient-to-t from-rose-400 to-pink-500 opacity-90 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                        : 'bg-white/15'
                    }`}
                    style={{
                      height: `${waveHeight}%`,
                      transform: isPlaying && isPassed ? `scaleY(${1 + Math.sin(currentAudioTime * 6 + i) * 0.25})` : 'scaleY(1)',
                    }}
                  />
                );
              })}
            </div>

            {/* Minimal Restart Button */}
            <motion.button
              whileTap={{ rotate: -180, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={handleRestartTrack}
              className="text-rose-200/80 hover:text-white transition-colors active:scale-90 cursor-pointer text-sm font-bold"
            >
              ↺
            </motion.button>
          </div>

          {/* Minimal Aesthetic Replay Trigger */}
          <AnimatePresence>
            {isSongEnded && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReloadWebsite}
                className="group relative py-2 px-4 flex items-center justify-center cursor-pointer transition-all"
              >
                <span className="text-xs font-light tracking-widest text-rose-200/90 group-hover:text-white transition-colors uppercase">
                  ✨ Begin Our Story Again ✨
                </span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-rose-300 to-transparent group-hover:w-full transition-all duration-300" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Footer Signature */}
      <div className="relative z-10 text-center mb-1">
        <p className="text-[10px] text-rose-200/50 font-medium">
          Made with ❤️ just for my Adelaide
        </p>
      </div>
    </div>
  );
}