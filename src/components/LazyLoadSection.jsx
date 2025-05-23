import React, { useRef, useState, useEffect, Suspense } from 'react';

// Fallback component for Suspense within LazyLoadSection
// This displays while the lazy-loaded component's code is being fetched
const ComponentCodeLoadingFallback = ({ height = '500px' }) => (
  <div
    className="w-full flex flex-col items-center justify-center bg-[#1b1b1b] text-gray-400 py-20"
    style={{ minHeight: height }}
  >
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
    <span className="mt-2">Loading section content...</span>
  </div>
);

const LazyLoadSection = ({ children, threshold = 0.1, rootMargin = '200px', initialHeight = '500px' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasRenderedOnce, setHasRenderedOnce] = useState(false); // To keep content rendered once it's visible

  useEffect(() => {
    // If the component has already been rendered once, no need to observe again
    if (hasRenderedOnce || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasRenderedOnce(true); // Mark that we've rendered the content
          observer.disconnect(); // Stop observing once content is visible
        }
      },
      { threshold, rootMargin } // `rootMargin` loads content slightly before it enters the viewport
    );

    observer.observe(ref.current);

    // Cleanup function: unobserve when the component unmounts or dependencies change
    return () => {
      if (ref.current && observer) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, hasRenderedOnce]); // Dependencies for this effect

  return (
    <div
      ref={ref}
      // Apply minHeight only if the content is not yet visible AND hasn't been rendered yet
      // This reserves space and prevents layout shifts while waiting for content to load
      style={{ minHeight: !isVisible && !hasRenderedOnce ? initialHeight : 'auto' }}
      className="w-full bg-[#1b1b1b]" // Ensure this wrapper has a solid background to prevent blackouts
    >
      {/* Render children only if visible or already rendered previously.
          Wrap children in Suspense to handle their lazy loading. */}
      {isVisible || hasRenderedOnce ? (
        <Suspense fallback={<ComponentCodeLoadingFallback height={initialHeight} />}>
          {children}
        </Suspense>
      ) : (
        // Fallback for when the section is not visible yet, providing visual feedback and reserving space
        <ComponentCodeLoadingFallback height={initialHeight} />
      )}
    </div>
  );
};

export default LazyLoadSection;