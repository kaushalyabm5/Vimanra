import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchGalleryImages, imagesForSlot } from '../../api/gallery';

// "All" leads and is the default, so the grid is never empty on first paint
// just because one category happens to have no images uploaded yet.
const ALL = 'All';
const CATEGORIES = [
  ALL,
  'Safari',
  'Hotel',
  'Rooms',
  'Pool',
  'Restaurant',
  'Nature',
  'Food',
  'Gardens',
];

// Grid layout span template to keep the exact Bento Grid layout across all categories
const SPAN_PATTERNS = [
  'col-span-1 md:col-span-2 row-span-2 h-[340px] md:h-[460px]',
  'col-span-1 md:col-span-1 h-[200px] md:h-[222px]',
  'col-span-1 md:col-span-1 h-[200px] md:h-[222px]',
  'col-span-1 md:col-span-1 h-[200px] md:h-[224px]',
  'col-span-1 md:col-span-1 h-[200px] md:h-[224px]',
  'col-span-1 md:col-span-1 h-[200px] md:h-[220px]',
  'col-span-1 md:col-span-1 h-[200px] md:h-[220px]',
  'col-span-1 md:col-span-2 h-[200px] md:h-[220px]',
  'col-span-1 md:col-span-1 h-[200px] md:h-[220px]',
  'col-span-1 md:col-span-1 h-[200px] md:h-[220px]',
  'col-span-1 md:col-span-1 h-[200px] md:h-[220px]',
  'col-span-1 md:col-span-1 h-[200px] md:h-[220px]',
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [galleryRows, setGalleryRows] = useState([]);

  useEffect(() => {
    fetchGalleryImages().then(setGalleryRows).catch(() => {});
  }, []);

  const galleryData = useMemo(() => {
    const bySection = imagesForSlot(galleryRows, 'gallery');
    return bySection.reduce((acc, row) => {
      const cat = row.category || 'Hotel';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({ id: row.image_id, title: row.title, image: row.image_url });
      return acc;
    }, {});
  }, [galleryRows]);

  // Map images to the Bento grid pattern dynamically
  const activeImages = useMemo(() => {
    const list =
      activeCategory === ALL
        ? Object.values(galleryData).flat()
        : galleryData[activeCategory] || [];
    return list.map((item, index) => ({
      ...item,
      span: SPAN_PATTERNS[index % SPAN_PATTERNS.length],
    }));
  }, [galleryData, activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSelectedIndex(null);
  };

  const handlePrev = useCallback(() => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? activeImages.length - 1 : prevIndex - 1
    );
  }, [activeImages.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prevIndex) =>
      prevIndex === activeImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [activeImages.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  return (
    <section id="gallery" className="bg-white py-24 md:py-36 px-4 sm:px-6 md:px-12 text-neutral-900">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10 md:mb-12">
          <div className="inline-block bg-neutral-100 border border-neutral-300/70 text-neutral-800 text-xs font-normal uppercase tracking-widest px-4 py-1.5 rounded-full">

            Visual Journey
          </div>

          <h2 className="text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-light text-neutral-950 tracking-tight leading-[1.12]">
            Resort Photo Gallery
          </h2>

          <p className="text-neutral-500 text-base sm:text-lg font-light leading-relaxed">
            Immerse yourself in moments of tranquil luxury, breathtaking Sri Lankan nature, and unforgettable experiences captured at our estate.
          </p>
        </div>

        {/* CATEGORY FILTER BUTTONS (SAFARI FIRST) */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-8 md:mb-12 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`cursor-pointer relative px-5 py-2 rounded-full text-[.8rem] tracking-wider uppercase transition-all duration-300 whitespace-nowrap border ${
                  isActive
                    ? 'bg-green-700 text-white shadow-sm font-medium'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200/80 hover:border-neutral-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* BENTO GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3.5"
          >
            {activeImages.map((img, index) => (
              <div
                key={img.id}
                onClick={() => setSelectedIndex(index)}
                className={`group relative rounded-lg overflow-hidden cursor-pointer bg-neutral-100 ${img.span}`}
              >
                <img
                  src={img.image}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white text-xs sm:text-sm font-light tracking-wide">{img.title}</p>
                </div>
              </div>
            ))}
            {activeImages.length === 0 && (
              <p className="col-span-full text-center text-neutral-400 text-sm py-16">No photos in this category yet.</p>
            )}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* LIGHTBOX POPUP */}
      <AnimatePresence>
        {selectedIndex !== null && activeImages[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-between p-4 sm:p-8 bg-black/95 backdrop-blur-md select-none"
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-5 right-5 z-50 p-3 rounded-full bg-black/40 hover:bg-white/20 text-white transition-all duration-200"
              aria-label="Close photo"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="z-50 p-3 rounded-full bg-black/50 hover:bg-white/20 border border-white/10 text-white transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center max-h-full px-2 sm:px-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center max-h-[90vh]"
                >
                  <img
                    src={activeImages[selectedIndex].image}
                    alt={activeImages[selectedIndex].title}
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-full max-h-[82vh] object-contain cursor-default shadow-2xl rounded-sm"
                  />
                  <p className="text-white/80 text-sm font-light mt-3 tracking-wide">
                    {activeImages[selectedIndex].title}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="z-50 p-3 rounded-full bg-black/50 hover:bg-white/20 border border-white/10 text-white transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
