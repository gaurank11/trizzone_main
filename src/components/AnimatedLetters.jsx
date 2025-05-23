import React from 'react';
import { motion, useTransform } from 'framer-motion';

export const AnimatedLetters = ({ text, scrollYProgress, range = [0, 0.3] }) => {
  const letters = text.split("");

  return (
    <>
      {letters.map((letter, i) => {
        const [animationStart, animationEnd] = range;

        // Calculate individual letter's scroll range for staggered animation.
        // The letter's animation will occur within a segment of the overall 'range'.
        const letterAnimationDuration = (animationEnd - animationStart) / letters.length;
        const letterStart = animationStart + (i * letterAnimationDuration);
        const letterEnd = letterStart + letterAnimationDuration;

        // Opacity transformation: Stays at 1 throughout the animation.
        const opacity = useTransform(
          scrollYProgress,
          [letterStart - 0.001, letterStart, letterEnd], // Small buffer to ensure full opacity
          [1, 1, 1] // Always full opacity
        );

        // Color transformation: Dims, then brightens to white within its range.
        const color = useTransform(
          scrollYProgress,
          [letterStart - 0.001, letterStart, letterEnd],
          ["#999999", "#999999", "#ffffff"] // Dimmed, then transition to white
        );

        return (
          <motion.span
            key={i} // Use index as key, since letters themselves are static within a text prop
            style={{ opacity, color }}
            className="inline-block will-change-transform" // Optimizes browser rendering
          >
            {letter === " " ? "\u00A0" : letter} {/* Preserve spaces */}
          </motion.span>
        );
      })}
    </>
  );
};