import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500); // 2.5 seconds splash
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
        className="fixed inset-0 z-[999] bg-black flex items-center justify-center"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="relative flex flex-col items-center">
            {/* Pulsating Logo Ring */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-[0_0_50px_#00aaff]"
            />
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-2xl font-bold text-white tracking-[0.5em]"
            >
                INITIALIZING...
            </motion.h1>
        </div>
    </motion.div>
  );
};