import React from 'react';
import { motion } from 'framer-motion';

export default function Stage1_5PuzzleRules({ onStart }) {
  return (
    <div className="relative w-full h-[100dvh] bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950 text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Rules Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-6 text-center shadow-2xl flex flex-col items-center"
      >
        <div className="text-4xl mb-3">🧩</div>

        <h2 className="text-2xl font-bold text-rose-200 tracking-wide mb-2">
          Memory Puzzle Challenge
        </h2>

        <p className="text-xs text-rose-100/70 mb-6">
          Let's play a quick memory game!
        </p>

        {/* Rules Checklist */}
        <div className="w-full text-left bg-black/20 rounded-2xl p-4 space-y-3 mb-6 border border-white/5">
          <div className="flex items-start gap-3">
            <span className="text-rose-400 font-bold">1.</span>
            <p className="text-xs text-rose-100/90 leading-relaxed">
              Tap any two image tiles to <strong>swap their positions</strong>.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-rose-400 font-bold">2.</span>
            <p className="text-xs text-rose-100/90 leading-relaxed">
              You'll solve <strong>3 photos</strong> in total (the last one is extra tricky!).
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-rose-400 font-bold">3.</span>
            <p className="text-xs text-rose-100/90 leading-relaxed">
              Stuck? You get <strong>1 preview glance</strong> per photo to peek at the original! 👁️
            </p>
          </div>
        </div>

        {/* Start Game Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-base shadow-xl shadow-rose-500/30 border border-rose-400/30 cursor-pointer"
        >
          I'm Ready! Let's Play 🎮
        </motion.button>
      </motion.div>
    </div>
  );
}