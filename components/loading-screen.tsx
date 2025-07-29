"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Animation duration - 3 seconds for plane movement + 1 second fade
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onLoadingComplete, 1000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-white dark:bg-gray-50 overflow-hidden"
        >
          {/* Airplane Trail */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100vh" }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut" 
            }}
            className="absolute left-1/2 bottom-0 w-0.5 bg-black/60 dark:bg-gray-700 origin-bottom"
            style={{ transform: "translateX(-50%)" }}
          />

          {/* Airplane */}
          <motion.div
            initial={{ y: "100vh", x: "-50%" }}
            animate={{ y: -100, x: "-50%" }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut" 
            }}
            className="absolute left-1/2 z-10"
          >
            {/* Paper Airplane SVG */}
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 32 32" 
              className="text-black dark:text-gray-700"
            >
              {/* Left wing */}
              <path
                d="M16 2 L4 28 L16 20 Z"
                fill="currentColor"
                opacity="0.7"
              />
              {/* Right wing */}
              <path
                d="M16 2 L28 28 L16 20 Z"
                fill="currentColor"
                opacity="0.9"
              />
              {/* Center body/fold */}
              <path
                d="M16 2 L16 30"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.5"
              />
              {/* Nose point highlight */}
              <circle
                cx="16"
                cy="2"
                r="1"
                fill="currentColor"
              />
            </svg>
          </motion.div>

          {/* Subtle fade overlay for trail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 2, 
              delay: 2 
            }}
            className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white dark:to-gray-50 pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen; 