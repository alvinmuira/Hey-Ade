import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const PUZZLE_LEVELS = [
  { id: 1, image: '/assets/photo-puzzle-1.jpeg', size: 3, title: 'Memory #1 📸', maxPreviews: 1 },
  { id: 2, image: '/assets/photo-puzzle-2.jpeg', size: 3, title: 'Memory #2 💕', maxPreviews: 1 },
  { id: 3, image: '/assets/photo-puzzle-3.jpeg', size: 3, title: 'The Grand Finale 🌟', maxPreviews: 2 },
];

export default function Stage2TilePuzzle({ onNext }) {
  const audioRef = useRef(null);

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isLevelSolved, setIsLevelSolved] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  // Preview / Hint State
  const [previewsUsed, setPreviewsUsed] = useState(0);
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  // Timeout State
  const [isTimedOut, setIsTimedOut] = useState(false);

  const currentLevel = PUZZLE_LEVELS[currentLevelIdx];
  const gridSize = currentLevel.size;
  const totalTiles = gridSize * gridSize;
  const maxPreviews = currentLevel.maxPreviews;

  // 1. Audio Setup (Runs ONLY ONCE when Stage 2 starts)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.log('Audio autoplay:', err));
    }

    return () => {
      // Pause when leaving Stage 2 entirely
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 2. Shuffle helper
  const shufflePuzzle = (size) => {
    const total = size * size;
    let shuffled = Array.from({ length: total }, (_, i) => i);
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (shuffled.every((val, idx) => val === idx));

    setTiles(shuffled);
  };

  // 3. Reset level state when level changes (without restarting audio!)
  useEffect(() => {
    setIsLevelSolved(false);
    setSelectedIdx(null);
    setPreviewsUsed(0);
    setIsPreviewActive(false);
    setIsTimedOut(false);

    shufflePuzzle(gridSize);
  }, [currentLevelIdx, gridSize]);

  // 4. Handle Global Timeout when song ends before completing all 3 photos
  const handleAudioEnded = () => {
    if (!allCompleted) {
      setIsTimedOut(true);

      setTimeout(() => {
        setIsTimedOut(false);
        setCurrentLevelIdx(0); // Reset back to Photo #1
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((err) => console.log(err));
        }
      }, 2500);
    }
  };

  // 5. Handle Tile Swap
  const handleTileClick = (index) => {
    if (isLevelSolved || isPreviewActive || isTimedOut) return;

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else if (selectedIdx === index) {
      setSelectedIdx(null);
    } else {
      const newTiles = [...tiles];
      const temp = newTiles[selectedIdx];
      newTiles[selectedIdx] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedIdx(null);

      const solved = newTiles.every((val, idx) => val === idx);
      if (solved) {
        setIsLevelSolved(true);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#fb7185', '#ffffff'],
        });

        if (currentLevelIdx === PUZZLE_LEVELS.length - 1) {
          setAllCompleted(true);
          // Pause song when all 3 photos are complete
          if (audioRef.current) {
            audioRef.current.pause();
          }
        }
      }
    }
  };

  // 6. Trigger Peek Preview
  const handlePeekPreview = () => {
    if (previewsUsed >= maxPreviews || isLevelSolved || isTimedOut) return;

    setPreviewsUsed((prev) => prev + 1);
    setIsPreviewActive(true);

    setTimeout(() => {
      setIsPreviewActive(false);
    }, 1500);
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < PUZZLE_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950 text-white flex flex-col items-center justify-between p-6 overflow-hidden">
      
      {/* Background puzzle audio track (plays continuously across all photos) */}
      <audio
        ref={audioRef}
        src="/assets/puzzle-bg.mp3"
        onEnded={handleAudioEnded}
      />

      {/* Background ambient glow */}
      <div className="absolute w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <motion.div
        key={`header-${currentLevelIdx}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mt-2"
      >
        <span className="text-xs uppercase tracking-widest text-rose-300/60 font-semibold">
          Puzzle {currentLevelIdx + 1} of {PUZZLE_LEVELS.length} ({gridSize}x{gridSize})
        </span>
        <h2 className="text-2xl font-bold text-rose-200 tracking-wide mt-0.5">
          {currentLevel.title}
        </h2>
        <p className="text-xs text-rose-100/70 mt-1">
          {isLevelSolved ? '✨ Beautifully solved!' : 'Beat the clock to unlock all 3!'}
        </p>
      </motion.div>

      {/* Grid Canvas Container */}
      <motion.div
        key={`grid-${currentLevelIdx}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-xs aspect-square p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl flex items-center justify-center overflow-hidden"
      >
        {/* TimeOut Overlay */}
        <AnimatePresence>
          {isTimedOut && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-lg flex flex-col items-center justify-center p-4 text-center"
            >
              <div className="text-4xl mb-2">⏰💥</div>
              <h3 className="text-2xl font-extrabold text-rose-300 drop-shadow-md">
                TImeOut Mommy
              </h3>
              <p className="text-xs text-rose-200/70 mt-1">
                Time ran out! Restarting from Photo #1...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full Image Reveal */}
        <AnimatePresence>
          {(isLevelSolved || isPreviewActive) && (
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={currentLevel.image}
              alt="Original Unsolved"
              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-xl z-30 shadow-2xl"
            />
          )}
        </AnimatePresence>

        {/* Tile Swap Grid */}
        <div
          className={`w-full h-full grid gap-1.5 ${
            gridSize === 4 ? 'grid-cols-4' : 'grid-cols-3'
          }`}
        >
          {tiles.map((tileValue, currentIndex) => {
            const originalRow = Math.floor(tileValue / gridSize);
            const originalCol = tileValue % gridSize;
            const bgX = (originalCol / (gridSize - 1)) * 100;
            const bgY = (originalRow / (gridSize - 1)) * 100;

            const isSelected = selectedIdx === currentIndex;

            return (
              <motion.button
                key={`${currentLevelIdx}-${currentIndex}`}
                layout
                onClick={() => handleTileClick(currentIndex)}
                className={`relative w-full h-full rounded-lg overflow-hidden transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'ring-4 ring-rose-400 scale-95 z-20 shadow-xl'
                    : 'hover:opacity-90 active:scale-95'
                }`}
                style={{
                  backgroundImage: `url(${currentLevel.image})`,
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: `${bgX}% ${bgY}%`,
                }}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-rose-500/25 border-2 border-rose-300 rounded-lg" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Control Actions & Buttons */}
      <div className="relative z-10 w-full max-w-xs mb-4 flex flex-col items-center min-h-[52px] gap-2">
        
        {!isLevelSolved && (
          <button
            onClick={handlePeekPreview}
            disabled={previewsUsed >= maxPreviews}
            className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md border transition-all ${
              previewsUsed >= maxPreviews
                ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white/10 border-white/20 text-rose-200 active:scale-95 cursor-pointer shadow-lg'
            }`}
          >
            {previewsUsed >= maxPreviews
              ? '👁️ Previews Used Up'
              : `👁️ Peek Photo (${maxPreviews - previewsUsed} Left)`}
          </button>
        )}

        <AnimatePresence mode="wait">
          {isLevelSolved && !allCompleted && (
            <motion.button
              key="next-level-btn"
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextLevel}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-base shadow-xl shadow-rose-500/30 border border-rose-400/30 cursor-pointer"
            >
              Jump onto the next challenge 🚀
            </motion.button>
          )}

          {allCompleted && (
            <motion.button
              key="final-stage-btn"
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-base shadow-xl shadow-emerald-500/30 border border-emerald-400/30 cursor-pointer"
            >
              Read My Notes 💌
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}