import React from 'react';
import img1 from '../../assets/images/welcomeImg/1.png';
import img3 from '../../assets/images/welcomeImg/2.png';
import img2 from '../../assets/images/heroImg/3.png';

const AboutUs = () => {
  return (
    <section id='about-us' className="bg-white min-h-screen flex items-center justify-center py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto text-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
        
        {/* Left Column: Content */}
        <div className="lg:col-span-6 space-y-6">
          {/* Welcome Badge */}
          

           <div className="inline-block bg-neutral-100 border border-neutral-300/70 text-neutral-800 text-xs font-normal uppercase tracking-widest px-4 py-1.5 rounded-full">
           Welcome to Vimanra
        </div>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl lg:text-5xl font-normal text-neutral-900 tracking-tight leading-[1.12]">
            Escape into nature while enjoying modern comfort at Vimanra Udawalawe.
          </h2>

          {/* Description */}
          <div className="text-neutral-600 text-base sm:text-lg font-light leading-relaxed tracking-normal max-w-xl space-y-4">
            <p>
              Located in the heart of Udawalawe, our boutique hotel is surrounded by lush tropical greenery and peaceful river views. Designed for travelers seeking relaxation and adventure, Vimanra combines elegant accommodation, exceptional hospitality, and authentic Sri Lankan cuisine to create a memorable experience.
            </p>
            <p>
              Whether you're planning a wildlife safari, a romantic getaway, or a family holiday, our dedicated team ensures every guest feels at home.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <a
              href="#accommodation"
              className="inline-block bg-green-600 hover:bg-slate-800 text-white font-light tracking-wide px-7 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Explore Our Rooms
            </a>
          </div>
        </div>

        {/* Right Column: Equal-Height 3-Image Grid */}
        <div className="lg:col-span-6 relative">
          {/* Background glow accent */}
          <div className="absolute -top-6 -left-6 w-48 h-48 bg-amber-200/40 rounded-full blur-2xl -z-10" />

          {/* Equal height image grid container */}
          <div className="grid grid-cols-2 gap-4 h-[400px] sm:h-[480px]">
            
            {/* Left Stack: 2 Images */}
            <div className="grid grid-rows-2 gap-4 h-full min-h-0">
              <div className="overflow-hidden rounded-2xl shadow-md group h-full w-full relative">
                <img
                  src={img1}
                  alt="Hotel Exterior Pool"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 block"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-md group h-full w-full relative">
                <img
                  src={img3}
                  alt="Luxury Suite Bed"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 block"
                />
              </div>
            </div>

            {/* Right Column: 1 Tall Image */}
            <div className="overflow-hidden rounded-2xl shadow-md group h-full w-full relative min-h-0">
              <img
                src={img2}
                alt="Hotel Lounge & Spa"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 block"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;