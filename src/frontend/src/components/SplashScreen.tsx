import { AnimatePresence, motion } from "motion/react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0a0a0a" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onAnimationComplete={() => {}}
    >
      {/* Cinematic letterbox bars */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-16 bg-black z-10"
        initial={{ scaleY: 2 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-16 bg-black z-10"
        initial={{ scaleY: 2 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,0,0.3) 0%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
      />

      {/* Particle rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-orange-500/20"
          initial={{ width: 80, height: 80, opacity: 0 }}
          animate={{
            width: 300 + i * 120,
            height: 300 + i * 120,
            opacity: [0, 0.4, 0],
          }}
          transition={{ delay: 0.6 + i * 0.3, duration: 1.8, ease: "easeOut" }}
        />
      ))}

      {/* Main logo container */}
      <motion.div
        className="relative z-20 flex flex-col items-center gap-4"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.3,
          duration: 0.9,
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        {/* RID text logo */}
        <div className="relative">
          {/* Glow behind text */}
          <div
            className="absolute inset-0 blur-2xl opacity-60"
            style={{ background: "linear-gradient(135deg, #ff6b00, #ff9500)" }}
          />
          <motion.h1
            className="relative text-7xl font-black tracking-[0.15em] select-none"
            style={{
              background:
                "linear-gradient(135deg, #ff9500 0%, #ffffff 40%, #ff6b00 70%, #ffcc00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.2em",
            }}
          >
            RID
          </motion.h1>
        </div>

        {/* Horizontal divider with glow */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-500" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-white/60 text-sm tracking-[0.4em] uppercase font-light"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          Ring ID
        </motion.p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-white/10 rounded-full overflow-hidden z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #ff6b00, #ffcc00)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.0, duration: 1.4, ease: "easeInOut" }}
          onAnimationComplete={onDone}
        />
      </motion.div>
    </motion.div>
  );
}
