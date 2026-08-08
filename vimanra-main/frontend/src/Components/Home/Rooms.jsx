import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { fetchRooms } from '../../api/rooms';
import { BOOKING_LINK_PROPS } from '../../config/booking';

const RoomCard = ({ room }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="group rounded-3xl bg-white border border-neutral-200/80 shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
      <div className="flex flex-col flex-grow">
        {/* IMAGE CAROUSEL SECTION */}
        <div className="relative h-56 sm:h-64 md:h-60 lg:h-64 w-full overflow-hidden bg-neutral-100 group/slider">
          <img
            src={room.images[currentImgIndex]}
            alt={`${room.title} - photo ${currentImgIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />

          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-md text-neutral-800 hover:bg-white hover:scale-110 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-all duration-200 shadow-md touch-manipulation z-10 cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-md text-neutral-800 hover:bg-white hover:scale-110 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-all duration-200 shadow-md touch-manipulation z-10 cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="absolute top-4 left-4 bg-neutral-900/80 backdrop-blur-md text-white text-[11px] font-light tracking-wider uppercase px-3 py-1 rounded-full z-10">
            {room.type}
          </span>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {room.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImgIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-5 sm:p-6 lg:p-7 space-y-4 flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight leading-tight">
                {room.title}
              </h3>
              <div className="text-right flex-shrink-0">
                <span className="text-xl sm:text-2xl font-light text-neutral-900 tracking-tight">{room.price}</span>
                <span className="block text-[11px] sm:text-xs font-light text-neutral-400">{room.period}</span>
              </div>
            </div>

            <p className="text-neutral-600 text-sm font-normal leading-relaxed line-clamp-3 md:line-clamp-none">
              {room.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
            {room.features.map((feature, idx) => (
              <span
                key={idx}
                className="text-[11px] sm:text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200/60 whitespace-nowrap"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CARD FOOTER / CTA */}
      <div className="px-5 sm:px-6 lg:px-7 pb-5 sm:pb-6 lg:pb-7 pt-1">
        <a
          {...BOOKING_LINK_PROPS}
          aria-label={`Book ${room.title}`}
          className="group/btn w-full cursor-pointer bg-green-600 hover:bg-green-500 text-white text-sm font-light tracking-wide py-3 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 touch-manipulation"
        >
          <Calendar className="w-4 h-4 text-white/90" />
          <span>Book This Room</span>
          <ArrowRight className="w-4 h-4 text-white/80 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </a>
      </div>
    </div>
  );
};

const Rooms = () => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [roomRows, setRoomRows] = useState([]);

  useEffect(() => {
    fetchRooms().then(setRoomRows).catch(() => {});
  }, []);

  const rooms = useMemo(
    () =>
      roomRows.map((room) => ({
        id: room.room_id,
        title: room.room_type,
        type: room.subtitle || '',
        price: `$${room.price}`,
        period: 'per night',
        description: room.description || '',
        features: room.features || [],
        images: [room.image_url].filter(Boolean),
      })),
    [roomRows]
  );

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    if (scrollLeft > 10 && !hasInteracted) {
      setHasInteracted(true);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [hasInteracted]);

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    setHasInteracted(true);

    const cardWidth = carouselRef.current.firstElementChild?.clientWidth || 360;
    const scrollAmount = direction === 'left' ? -(cardWidth + 24) : (cardWidth + 24);

    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="accommodation" className="bg-white py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto text-neutral-900 scroll-mt-24">
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-14 md:mb-16">
        <div className="inline-block bg-neutral-100 border border-neutral-300/70 text-neutral-800 text-xs font-normal uppercase tracking-widest px-4 py-1.5 rounded-full">
          Accommodation
        </div>

        <h2 className="text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-light text-neutral-950 tracking-tight leading-[1.15]">
          Stay in Natural Elegance
        </h2>

        <p className="text-neutral-500 text-sm sm:text-base md:text-lg font-light leading-relaxed tracking-normal px-2">
          Designed with tranquil lakefront aesthetics, our spacious double, triple, and family rooms offer high-end comfort surrounded by Udawalawa’s greenery.
        </p>
      </div>

      {/* CAROUSEL CONTAINER */}
      <div className="relative group/carousel">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-4 md:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-3.5 rounded-full bg-white border border-neutral-200 shadow-xl text-neutral-800 hover:bg-neutral-50 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Right Arrow Button (Standard compact size placed cleanly outside card boundaries) */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className={`absolute -right-3 sm:-right-4 md:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-3.5 rounded-full bg-green-600 text-white border-2 border-white shadow-[0_8px_20px_rgba(22,163,74,0.35)] hover:bg-green-500 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center ${
              !hasInteracted ? 'animate-bounce' : ''
            }`}
            aria-label="Scroll right to view more room types"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-2 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {rooms.map((room) => (
            <div
              key={room.id}
              className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0 snap-start"
            >
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
