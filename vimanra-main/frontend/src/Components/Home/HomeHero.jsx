import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { fetchGalleryImages, imagesForSlot } from '../../api/gallery';
import { BOOKING_LINK_PROPS } from '../../config/booking';

// Importing PNG images from src/assets/images/heroImg/
import heroImg1 from '../../assets/images/heroImg/1.png';
import heroImg2 from '../../assets/images/heroImg/2.png';
import heroImg3 from '../../assets/images/heroImg/3.png';
import heroImg4 from '../../assets/images/heroImg/4.png';
import heroImg5 from '../../assets/images/heroImg/5.png';
import heroImg6 from '../../assets/images/heroImg/6.png';

const defaultImages = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5, heroImg6];

export default function HomeHero() {
  const [images, setImages] = useState(defaultImages);
  const [[page, direction], setPage] = useState([0, 1]);

  useEffect(() => {
    fetchGalleryImages()
      .then((rows) => {
        const heroImages = imagesForSlot(rows, 'hero').map((row) => row.image_url);
        if (heroImages.length > 0) setImages(heroImages);
      })
      .catch(() => {});
  }, []);

  // Wrap index around total image count
  const imageIndex = ((page % images.length) + images.length) % images.length;

  const paginate = (newDirection) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  };

  // Continuous auto-play timer: 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Framer Motion variants
  const ultraSlowZoomVariants = {
    enter: {
      opacity: 0,
      scale: 1,
    },
    center: {
      opacity: 1,
      scale: 1.08,
      transition: {
        opacity: { duration: 1.8, ease: 'easeInOut' },
        scale: { duration: 8, ease: 'linear' },
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: {
        opacity: { duration: 1.8, ease: 'easeInOut' },
        scale: { duration: 1.8, ease: 'linear' },
      },
    },
  };

  return (
    <section id='home' className="relative h-[100dvh] w-full overflow-hidden flex flex-col justify-center items-center text-white select-none">
      {/* Background Image Carousel Container */}
      <div className="absolute inset-0 -z-10 bg-black overflow-hidden">
        <AnimatePresence initial={true}>
          <motion.img
            key={page}
            src={images[imageIndex]}
            variants={ultraSlowZoomVariants}
            initial="enter"
            animate="center"
            exit="exit"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Clean Dark Overlay */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none" />
      </div>

      {/* Main Content Container - Centered Vertically & Horizontally */}
      <div className="z-10 w-full max-w-7xl text-center px-6 sm:px-12 md:px-16 flex flex-col items-center justify-center my-auto">
        {/* Top Floating Badge 
        <div className="mb-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-medium text-white shadow-xl">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
            <span>Voted best peaceful place in the world</span>
          </div>
        </div>*/}

        {/* Heading */}
        <h1 className="text-[2rem] md:text-[3.5rem] lg:text-[4.4rem] max-w-5xl font-light tracking-tight text-white leading-[1.18] text-center w-full">
          Experience the Beauty of Udawalawe in <br className="hidden sm:inline" />
          <span className="font-serif italic font-normal text-green-100"> Comfort & Serenity </span>
        </h1>

        {/* Paragraph */}
        <p className="mt-4 sm:mt-6 text-[.8rem] md:text-[.9rem] lg:text-[.9rem] text-slate-200/90 font-light max-w-md sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed text-center">
          Nestled beside a peaceful river and just minutes from Udawalawe National Park, Vimanra offers a perfect blend of nature, comfort, and authentic Sri Lankan hospitality. Whether you're here for a safari adventure, a family vacation, or a relaxing getaway, every stay is designed to create unforgettable memories.

        </p>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-md mx-auto">
          <a
            {...BOOKING_LINK_PROPS}
            className="w-full sm:w-auto text-center cursor-pointer bg-green-600 hover:bg-green-500 text-white font-medium text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-300 shadow-2xl hover:shadow-green-500/20 active:scale-95"
          >
            Book Your Stay
          </a>
          
          <button className="w-full sm:w-auto cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-medium text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-300 shadow-xl active:scale-95">
            Explore Rooms
          </button>
        </div>
      </div>

      {/* Glassmorphism Arrow Buttons - Safely positioned on viewport edges */}
      <button
        onClick={() => paginate(-1)}
        aria-label="Previous Slide"
        className="absolute cursor-pointer left-3 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 md:p-3 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 transition-all duration-300 shadow-lg active:scale-90 group"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
      </button>

      <button
        onClick={() => paginate(1)}
        aria-label="Next Slide"
        className="absolute right-3 cursor-pointer sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 md:p-3 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 transition-all duration-300 shadow-lg active:scale-90 group"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Pagination Dots - Positioned cleanly relative to viewport bottom */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 sm:gap-2.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              const newDirection = idx > imageIndex ? 1 : -1;
              setPage(([prevPage]) => [prevPage + (idx - imageIndex), newDirection]);
            }}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 cursor-pointer ${
              idx === imageIndex
                ? 'w-6 sm:w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}