import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const ChaosOrbCursor = () => {
  const CURSOR_SIZE = 180;
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  
  const springConfig = { damping: 25, stiffness: 120, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX - CURSOR_SIZE / 2);
      mouseY.set(clientY - CURSOR_SIZE / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, CURSOR_SIZE]);

  return (
    <motion.div
      style={{ translateX: smoothX, translateY: smoothY, width: CURSOR_SIZE, height: CURSOR_SIZE }}
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center hidden md:flex mix-blend-screen"
    >
      <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[1px] rounded-full shadow-[0_0_80px_rgba(0,100,255,0.15)]"></div>
      <motion.div
        animate={{
            x: [0, 25, -35, 15, -20, 0],
            y: [0, -15, 25, -30, 10, 0],
            scale: [1, 1.2, 0.8, 1.1, 0.9, 1],
            backgroundColor: [
              "rgba(0, 255, 255, 0.9)", "rgba(0, 100, 255, 0.9)", "rgba(180, 0, 255, 0.9)",
              "rgba(255, 0, 150, 0.9)", "rgba(255, 50, 50, 0.9)", "rgba(255, 255, 0, 0.9)",
              "rgba(0, 255, 100, 0.9)", "rgba(0, 255, 255, 0.9)"
            ],
            boxShadow: [
              "0 0 30px rgba(0, 255, 255, 1), 0 0 60px rgba(0, 255, 255, 0.5)",
              "0 0 30px rgba(0, 100, 255, 1), 0 0 60px rgba(0, 100, 255, 0.5)",
              "0 0 30px rgba(180, 0, 255, 1), 0 0 60px rgba(180, 0, 255, 0.5)",
              "0 0 30px rgba(255, 0, 150, 1), 0 0 60px rgba(255, 0, 150, 0.5)",
              "0 0 30px rgba(255, 50, 50, 1), 0 0 60px rgba(255, 50, 50, 0.5)",
              "0 0 30px rgba(255, 255, 0, 1), 0 0 60px rgba(255, 255, 0, 0.5)",
              "0 0 30px rgba(0, 255, 100, 1), 0 0 60px rgba(0, 255, 100, 0.5)",
              "0 0 30px rgba(0, 255, 255, 1), 0 0 60px rgba(0, 255, 255, 0.5)"
            ]
        }}
        transition={{
            default: { duration: 0.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
            backgroundColor: { duration: 8, repeat: Infinity, ease: "linear" },
            boxShadow: { duration: 8, repeat: Infinity, ease: "linear" }
        }}
        className="w-14 h-14 rounded-full blur-md"
      />
    </motion.div>
  );
};
export default ChaosOrbCursor;