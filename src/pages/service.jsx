import React, { lazy } from 'react';
import LazyLoadSection from '../components/LazyLoadSection'; // Import the new wrapper component

// Lazy-import each main service section component.
// This ensures their JavaScript bundles are fetched only when needed.
const Service1 = lazy(() => import('../components/service1'));
const Service3 = lazy(() => import('../components/service3'));
const Service4 = lazy(() => import('../components/service4'));
const Service6 = lazy(() => import('../components/service6'));

const ServicePage = () => {
  return (
    // Main container for the entire page, ensuring a consistent background color
    <div className="bg-[#1b1b1b]">
      {/* Service1: This is your above-the-fold content.
          It's rendered directly within a Suspense boundary for its own code loading,
          but not wrapped in LazyLoadSection, ensuring it's available immediately. */}
      <LazyLoadSection initialHeight="100vh" threshold={0} rootMargin="0px">
        {/* Service1 is always the first content, so it should be visible instantly.
            Wrapping it in LazyLoadSection with threshold 0 and rootMargin 0px will ensure it's loaded as soon as
            it's observed, which should be immediately. This is a robust way to ensure
            it's always part of the initial render flow while still using the pattern.*/}
        <Service1 />
      </LazyLoadSection>


      {/* Service3: Wrapped in LazyLoadSection for delayed loading based on scroll.
          initialHeight should be an estimated height to prevent layout shifts. */}
      <LazyLoadSection initialHeight="700px" rootMargin="300px"> {/* Load when 300px from viewport */}
        <Service3 />
      </LazyLoadSection>

      {/* Service4: Similar lazy loading setup. Adjust initialHeight as needed. */}
      <LazyLoadSection initialHeight="1500px" rootMargin="300px"> {/* Adjust based on its content (3 sub-sections) */}
        <Service4 />
      </LazyLoadSection>

      {/* Service6: Similar lazy loading setup. Adjust initialHeight as needed. */}
      <LazyLoadSection initialHeight="400px" rootMargin="200px">
        <Service6 />
      </LazyLoadSection>
    </div>
  );
};

export default ServicePage;