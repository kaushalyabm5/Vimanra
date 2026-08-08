import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css'; // Imports recommended Lenis base styles

import HomePage from './Components/Home/HomePage';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ScrollToTop from './Components/ScrollToTop';
import SplashScreen from './Components/SplashScreen';

// Splash stays up at least this long so the brand crest never just flickers,
// and never longer than the cap even if a slow asset is still streaming in.
const SPLASH_MIN_MS = 2000;
const SPLASH_MAX_MS = 5000;

const App = () => {
  const [loading, setLoading] = useState(true);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // Scroll animation duration (seconds)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth deceleration curve
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      // Let Lenis drive in-page #anchor links too. Without this the browser
      // jumps natively and fights the smooth-scroll loop. The offset clears
      // the fixed navbar so a target is not left underneath it.
      anchors: { offset: -100 },
    });

    lenisRef.current = lenis;

    // Request Animation Frame loop to drive Lenis updates
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Clean up instance on unmount
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Dismiss the splash once the page has finished loading, bounded by min/max.
  useEffect(() => {
    const start = performance.now();
    let minTimer;

    const finish = () => {
      const elapsed = performance.now() - start;
      minTimer = setTimeout(() => setLoading(false), Math.max(0, SPLASH_MIN_MS - elapsed));
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    const maxTimer = setTimeout(() => setLoading(false), SPLASH_MAX_MS);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      window.removeEventListener('load', finish);
    };
  }, []);

  // Freeze the page underneath the splash, and always open at the top.
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      lenisRef.current?.stop();
    } else {
      document.body.style.overflow = '';
      lenisRef.current?.scrollTo(0, { immediate: true });
      lenisRef.current?.start();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  return (
    <div>
      <AnimatePresence>{loading && <SplashScreen key="splash" />}</AnimatePresence>

      <Navbar />
      <HomePage />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default App;
