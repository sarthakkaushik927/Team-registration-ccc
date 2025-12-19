import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const inputClasses = `
  w-full px-4 py-3
  bg-black/30 backdrop-blur-md
  border border-[#00aaff]/50
  rounded-xl
  text-white text-sm font-medium tracking-wide
  placeholder-gray-500
  focus:outline-none focus:border-[#00aaff] focus:bg-black/40 focus:shadow-[0_0_20px_rgba(0,170,255,0.2)]
  transition-all duration-300
`;

export const FormInput = ({ name, type, register, error, placeholder, ...rest }) => (
  <div className="mb-1 relative z-0 w-full">
    <div className="relative group">
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        {...register(name)}
        {...rest}
        className={`${inputClasses} ${error ? 'border-red-500 focus:border-red-500' : ''}`}
      />
    </div>
    <div className="min-h-[16px]">
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-red-400 text-[10px] pl-2 pt-1"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export const FormSelect = ({ name, setValue, watch, error, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedValue = watch(name);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setValue(name, value, { shouldValidate: true });
    setIsOpen(false);
  };

  return (
    <div className="mb-1 relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputClasses} cursor-pointer flex items-center justify-between ${!selectedValue ? 'text-gray-400' : 'text-white'} ${error ? 'border-red-500' : ''}`}
      >
        <span>{selectedValue || placeholder}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00aaff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_5px_rgba(0,170,255,0.8)]">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 p-2 bg-[#050505]/95 backdrop-blur-xl border border-[#00aaff]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-[100] max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => (
              <motion.div
                key={option}
                onClick={() => handleSelect(option)}
                whileHover={{ backgroundColor: "rgba(0, 170, 255, 0.15)", x: 4 }}
                className={`px-4 py-3 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                  selectedValue === option ? 'text-[#00aaff] bg-[#00aaff]/10' : 'text-gray-300 hover:text-white'
                }`}
              >
                {option}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[16px]">
        <AnimatePresence>
          {error && <motion.p className="text-red-400 text-[10px] pl-2 pt-1">{error.message}</motion.p>}
        </AnimatePresence>
      </div>
    </div>
  );
};