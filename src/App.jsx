import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Stage0BearIntro from './components/Stage0BearIntro';
import Stage1HeartCanvas from './components/Stage1HeartCanvas';
import Stage1_5PuzzleRules from './components/Stage1_5PuzzleRules';
import Stage2TilePuzzle from './components/Stage2TilePuzzle';
import Stage3NoteCards from './components/Stage3NoteCards';

export default function App() {
  // Stage 0: Bear Intro
  // Stage 1: Particle Heart
  // Stage 1.5: Puzzle Rules Splash
  // Stage 2: Photo Tile Puzzle
  // Stage 3: Note Cards
  const [currentStage, setCurrentStage] = useState(0);

  const handleNextStage = () => {
    setCurrentStage((prev) => prev + 1);
  };

  return (
    <main className="w-full h-[100dvh] bg-slate-950 text-white overflow-hidden relative font-sans">
      <AnimatePresence mode="wait">
        {currentStage === 0 && (
          <motion.div
            key="stage0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <Stage0BearIntro onNext={handleNextStage} />
          </motion.div>
        )}

        {currentStage === 1 && (
          <motion.div
            key="stage1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <Stage1HeartCanvas onNext={handleNextStage} />
          </motion.div>
        )}

        {currentStage === 2 && (
          <motion.div
            key="stage1_5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <Stage1_5PuzzleRules onStart={handleNextStage} />
          </motion.div>
        )}

        {currentStage === 3 && (
          <motion.div
            key="stage2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <Stage2TilePuzzle onNext={handleNextStage} />
          </motion.div>
        )}

        {currentStage === 4 && (
          <motion.div
            key="stage3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <Stage3NoteCards />
          </motion.div>
        )} 
      </AnimatePresence>
    </main>
  );
}