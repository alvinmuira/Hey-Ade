import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Stage1HeartCanvas({ onNext }) {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showLoveText, setShowLoveText] = useState(false);

  useEffect(() => {
    // Attempt audio play immediately on component load
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log("Autoplay prevented by browser:", err);
        setIsPlaying(false);
      });
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = 1500; // Increased density for flashier effect
    let frame = 0;
    let completed = false;

    const cx = width / 2;
    const cy = height / 2 - 10;
    const scale = Math.min(width, height) / 38;

    // Generate Heart Vertices with extra sparkle & ambient dust
    for (let i = 0; i < particleCount; i++) {
      const t = (Math.PI * 2 * i) / particleCount;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );

      particles.push({
        targetX: cx + x * scale,
        targetY: cy + y * scale,
        x: cx + (Math.random() - 0.5) * width * 1.5,
        y: cy + (Math.random() - 0.5) * height * 1.5,
        size: Math.random() * 2.5 + 1,
        speed: Math.random() * 0.035 + 0.02,
        alpha: Math.random() * 0.7 + 0.3,
        // Flashy vibrant pinks, golds, and bright roses
        hue: 330 + Math.random() * 30,
        brightness: 60 + Math.random() * 30,
      });
    }

    let animationFrameId;

    const render = () => {
      // Clear with slight trailing effect over the gradient
      ctx.clearRect(0, 0, width, height);

      frame++;
      let inPosition = 0;

      // Subtle heartbeat pulse scale factor once assembled
      const pulseScale = completed ? 1 + Math.sin(frame * 0.08) * 0.03 : 1;

      particles.forEach((p) => {
        // Move towards target heart shape
        p.x += (p.targetX - p.x) * p.speed;
        p.y += (p.targetY - p.y) * p.speed;

        // Apply heartbeat scaling relative to center
        const dx = p.x - cx;
        const dy = p.y - cy;
        const currentX = cx + dx * pulseScale;
        const currentY = cy + dy * pulseScale;

        // Sparkle shimmer effect
        const sparkle = Math.sin(frame * 0.1 + p.targetX) * 0.2;
        const currentAlpha = Math.min(1, Math.max(0.1, p.alpha + sparkle));

        ctx.beginPath();
        ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.brightness}%, ${currentAlpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#f43f5e';
        ctx.fill();

        if (Math.hypot(p.targetX - p.x, p.targetY - p.y) < 2) {
          inPosition++;
        }
      });

      // Heart assembly trigger
      if (!completed && (inPosition > particleCount * 0.88 || frame > 200)) {
        completed = true;
        setShowLoveText(true);

        // Wait 3 seconds with "Hey love 🥹" visible before automatic transition
        setTimeout(() => {
          onNext();
        }, 3000);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onNext]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950 overflow-hidden flex flex-col items-center justify-center p-6 text-white">
      
      {/* 10-second transitional audio */}
      <audio ref={audioRef} src="/assets/song.mp3" autoPlay />

      {/* Floating Audio Control */}
      <button
        onClick={toggleAudio}
        className="absolute top-6 right-6 z-30 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-rose-200 shadow-lg active:scale-95 transition-all cursor-pointer"
      >
        {isPlaying ? '🔊 Mute' : '🔈 Play Audio'}
      </button>

      {/* Background ambient glow matching Stage 0 */}
      <div className="absolute w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Heart Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Centered "Hey love 🥹" overlay text */}
      <AnimatePresence>
        {showLoveText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-20 text-center pointer-events-none drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-rose-100 tracking-wide font-sans">
              Hey love 🥹
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}