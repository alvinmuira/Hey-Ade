import React from 'react';
import { motion } from 'framer-motion';

export default function Stage0BearIntro({ onNext }) {
  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950 text-white overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-6 text-center shadow-2xl flex flex-col items-center"
      >
        {/* Animated Sticker/GIF Area */}
        <div className="relative w-48 h-48 mb-4 flex items-center justify-center overflow-hidden rounded-2xl">
          <img
            src="/assets/bear-slap.gif"
            alt="Bear Slap Animation"
            className="w-full h-full object-contain drop-shadow-md"
            // Optional fallback image if GIF is missing during setup
            onError={(e) => {
              e.currentTarget.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHJrbmxvdGFiZnIza3RuaXVscGtyMnczcXcxdmZxaHRkNmF0aWF1cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/93lEttRMS3UpxcIvPG/giphy.gif";
            }}
          />
        </div>

        {/* Playful Headline */}
        <h1 className="text-2xl font-bold text-rose-200 tracking-wide mb-2">
          Hey Adelaide Mine🥹
        </h1>

        {/* Cute Subtext */}
        <p className="text-sm text-rose-100/80 leading-relaxed mb-6">
          Me make this for Adelaide cos me love my mommy🥹😘
        </p>

        {/* Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-base shadow-lg shadow-rose-500/25 border border-rose-400/30 active:opacity-90 transition-all cursor-pointer"
        >
          😝😝CLICK ME😝😝
        </motion.button>
      </motion.div>

      {/* Bottom Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-6 text-xs text-rose-200/50 tracking-wider uppercase font-medium"
      >
        Tap button to begin
      </motion.p>
    </div>
  );
}