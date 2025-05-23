import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const RotatingImages = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Tracks which image URLs have been successfully loaded into the browser cache
  const [imageLoadedStatuses, setImageLoadedStatuses] = useState(() =>
    new Array(images.length).fill(false)
  );
  // Indicates if the *currently displayed* image is ready for rendering
  const [currentImageReady, setCurrentImageReady] = useState(false);
  const intervalRef = useRef(null);

  // Memoized function to handle image loading
  const loadImage = useCallback((src, index, isCurrent = false) => {
    return new Promise(resolve => {
      // If already loaded, resolve immediately
      if (imageLoadedStatuses[index]) {
        if (isCurrent) setCurrentImageReady(true);
        return resolve();
      }

      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageLoadedStatuses(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        if (isCurrent) setCurrentImageReady(true);
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        setImageLoadedStatuses(prev => { // Mark as loaded even on error to avoid infinite retries
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        if (isCurrent) setCurrentImageReady(true); // Treat as ready to avoid blocking
        resolve();
      };
    });
  }, [imageLoadedStatuses]); // Recalculate if loaded statuses change

  // Effect for managing image loading (current and next)
  useEffect(() => {
    setCurrentImageReady(false); // Reset readiness until current image is confirmed
    loadImage(images[currentIndex], currentIndex, true); // Load the current image, marking it as current

    // Preload the next image in the sequence
    const nextIndex = (currentIndex + 1) % images.length;
    loadImage(images[nextIndex], nextIndex); // Load next image without blocking current readiness

  }, [currentIndex, images, loadImage]); // Re-run when current index changes or images array changes

  // Effect for managing the automatic rotation interval
  useEffect(() => {
    // Clear any existing interval to prevent multiple intervals running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start a new interval only if the current image is ready
    // This prevents the carousel from rotating before images are loaded
    if (currentImageReady) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000); // 3 seconds rotation interval
    }

    // Cleanup function: clears the interval when the component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentImageReady, images.length]); // Dependencies for this effect

  const currentImageSrc = images[currentIndex];

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center">
      <AnimatePresence initial={false} mode='wait'> {/* `mode='wait'` ensures one animation finishes before the next starts */}
        {/* Render the image only if currentImageReady is true (i.e., it's loaded) */}
        {currentImageReady ? (
          <motion.img
            key={currentImageSrc} // Unique key ensures Framer Motion correctly animates entry/exit
            src={currentImageSrc}
            alt="Service visual"
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
            initial={{ opacity: 0 }} // Start invisible
            animate={{ opacity: 1 }} // Fade in
            exit={{ opacity: 0 }} // Fade out
            transition={{ duration: 0.8, ease: "easeInOut" }}
            loading="eager" // 'eager' hint is fine as we manually manage loading
          />
        ) : (
          // Placeholder div ensures a solid background and loading indicator during transitions
          <motion.div
            key="placeholder" // Unique key for the placeholder
            className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-500"
            initial={{ opacity: 1 }} // Ensures it's fully visible immediately
            animate={{ opacity: 1 }} // Stays visible
            exit={{ opacity: 0 }} // Fades out when the image becomes ready
            transition={{ duration: 0.3 }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            <span className="ml-3">Loading image...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};