import React from 'react';
import { Calendar, PhoneCall, Sparkles, MapPin } from 'lucide-react';
import { BOOKING_LINK_PROPS } from '../../config/booking';

const CTA = () => {
  return (
    <section className="bg-white py-12 md:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
      {/* CARD CONTAINER WITH SLIGHTLY BALANCED HEIGHT */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl py-12 px-6 sm:p-12 md:p-14 flex items-center justify-center text-center text-white">
        
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80"
          alt="Vimanra Udawalawe Resort View"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[2px]" />

        {/* BALANCED CENTERED CONTENT */}
        <div className="relative z-10 max-w-2xl mx-auto space-y-5 flex flex-col items-center w-full">
          
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-1.5 bg-green-950/60 border border-green-500/40 text-green-300 text-xs font-medium uppercase tracking-widest px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-green-500 shrink-0" />
            <span>Call To Action</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
            Your Adventure <span className="font-medium text-green-500">Begins Here</span>
          </h2>

          {/* Description */}
          <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed max-w-xl">
            Experience comfort, nature, and authentic Sri Lankan hospitality at <span className="text-white font-normal">Vimanra Udawalawe</span>. Book your stay today and create unforgettable memories in the heart of Sri Lanka's wildlife paradise.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto pt-2">
            
            <a
              {...BOOKING_LINK_PROPS}
              className="w-full sm:w-auto cursor-pointer bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-medium tracking-wide px-7 py-3 rounded-full transition-all duration-300 shadow-md shadow-green-500/20 flex items-center justify-center gap-2.5"
            >
              <Calendar className="w-4 h-4 text-white shrink-0" />
              <span>Book Now</span>
            </a>

            <a
              href="#contact"
              className="w-full sm:w-auto cursor-pointer bg-white/10 hover:bg-white/20 active:scale-95 text-white text-sm font-light tracking-wide px-7 py-3 rounded-full transition-all duration-300 border border-white/20 hover:border-green-500/50 backdrop-blur-md flex items-center justify-center gap-2.5"
            >
              <PhoneCall className="w-4 h-4 text-green-500 shrink-0" />
              <span>Contact Reception</span>
            </a>

          </div>

          {/* Location & Direct Support Info */}
          <div className="flex items-center justify-center gap-2 text-xs font-light text-neutral-400 pt-1">
            <MapPin className="w-3.5 h-3.5 text-green-500 shrink-0" />
            <span>Udawalawe, Sri Lanka</span>
            <span className="text-neutral-600">•</span>
            <span>Instant Confirmation</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTA;