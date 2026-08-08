import React, { useEffect, useMemo, useState } from 'react';
import {
  Waves,
  Trees,
  Utensils,
  Wifi,
  Car,
  Compass,
  PlaneTakeoff,
  ConciergeBell,
  Shirt,
  Sun,
  Users,
  Accessibility,
  Zap,
  Sparkles,
  Coffee,
  Binoculars,
  Bike,
  CheckCircle2
} from 'lucide-react';
import { fetchServices } from '../../api/services';

const ICONS = {
  Waves, Trees, Utensils, Wifi, Car, Compass, PlaneTakeoff, ConciergeBell,
  Shirt, Sun, Users, Accessibility, Zap, Sparkles, Coffee, Binoculars, Bike,
};

const Facilities = () => {
  const [serviceRows, setServiceRows] = useState([]);

  useEffect(() => {
    fetchServices().then(setServiceRows).catch(() => {});
  }, []);

  const facilities = useMemo(
    () =>
      serviceRows
        .filter((s) => s.status === 'Active')
        .map((s) => ({
          id: s.service_id,
          title: s.service_name,
          category: s.category || '',
          description: s.description || '',
          image: s.image_url || '',
          icon: ICONS[s.icon] || Sparkles,
          highlights: s.highlights || [],
        })),
    [serviceRows]
  );

  return (
    <section id="facilities" className="bg-white py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto text-neutral-900">

      {/* SECTION HEADER (UNTOUCHED) */}
      <div className="text-center max-w-4xl mx-auto space-y-4 mb-16 md:mb-24">

        {/* Small Pill Badge */}
        <div className="inline-block bg-neutral-100 border border-neutral-300/70 text-neutral-800 text-xs font-normal uppercase tracking-widest px-4 py-1.5 rounded-full">
          Amenities & Facilities
        </div>

        {/* Main Title */}
        <h2 className="text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-light text-neutral-950 tracking-tight leading-[1.12]">
          Crafted for Comfort & Leisure
        </h2>

        {/* Main Description */}
        <p className="text-neutral-500 text-base sm:text-lg font-light leading-relaxed tracking-normal">
          From tranquil infinity pool dips to thrilling wildlife excursions, explore our premium resort offerings designed to make your stay truly memorable.
        </p>

      </div>

      {/* CLEAN & SIMPLE VERTICAL ROW LIST */}
      <div className="space-y-16 md:space-y-24">
        {facilities.map((item, index) => {
          const IconComponent = item.icon;
          const isEven = index % 2 === 0;

          return (
            <div
              key={item.id}
              className={`flex flex-col gap-8 md:gap-16 items-center ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Image Block with Rounded Corners */}
              <div className="w-full lg:w-1/2 h-72 sm:h-96 overflow-hidden bg-neutral-100 rounded-2xl">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Content Block */}
              <div className="w-full lg:w-1/2 space-y-6">

                {/* Meta Header with Fully Rounded Green Icon */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-600 text-white rounded-full flex items-center justify-center shadow-sm">
                    <IconComponent className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  {item.category && (
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                    {item.category}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-light text-neutral-950 tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 text-base font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Highlights with Green Check Icons */}
                {item.highlights.length > 0 && (
                  <div className="pt-4 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        <span className='text-neutral-800 font-bold'>{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default Facilities;
