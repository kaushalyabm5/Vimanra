import React, { useEffect, useMemo, useState } from 'react';
import {
  MapPin,
  Clock,
  Compass,
  Eye,
  Binoculars,
  HeartHandshake,
  Waves,
  Landmark,
  Sparkles,
  Bike,
  Trees
} from 'lucide-react';
import { fetchThingsToDo } from '../../api/thingsToDo';

const ICONS = { Eye, Binoculars, HeartHandshake, Waves, Landmark, Sparkles, Bike, Trees, Compass };

const ThingsToDo = () => {
  const [thingRows, setThingRows] = useState([]);

  useEffect(() => {
    fetchThingsToDo().then(setThingRows).catch(() => {});
  }, []);

  const thingsToDo = useMemo(
    () =>
      thingRows.map((t) => ({
        id: t.thing_id,
        title: t.title,
        category: t.category || '',
        icon: ICONS[t.icon] || Compass,
        distance: t.distance || '',
        time: t.time || '',
        description: t.description || '',
        image: t.image_url || '',
      })),
    [thingRows]
  );

  return (
    <section id="things-to-do" className="bg-white py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto text-neutral-900">

      {/* SECTION HEADER (CENTERED) */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 md:mb-20">

        {/* Small Pill Badge */}
        <div className="inline-block bg-neutral-100 border border-neutral-300/70 text-neutral-800 text-xs font-normal uppercase tracking-widest px-4 py-1.5 rounded-full">
          Local Attractions
        </div>

        {/* Main Title */}
        <h2 className="text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-light text-neutral-950 tracking-tight leading-[1.12]">
          Things To Do Around Us
        </h2>

        {/* Main Description */}
        <p className="text-neutral-500 text-base sm:text-lg font-light leading-relaxed tracking-normal">
          Explore iconic wildlife parks, historical landmarks, and tranquil lakeside spots located just minutes away from our resort.
        </p>

      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {thingsToDo.map((item) => {
          const CardIcon = item.icon || Compass;

          return (
            <div
              key={item.id}
              className="group relative min-h-[440px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between p-6 text-white"
            >
              {/* Background Image */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              )}

              {/* Dark Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/60 to-neutral-950/30 group-hover:from-neutral-950 transition-all duration-300" />

              {/* TOP BAR: Category Pill + Category Icon */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[11px] font-light tracking-wider uppercase text-white/90 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  {item.category}
                </span>
                <div className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white group-hover:bg-green-600 group-hover:border-green-600 transition-all duration-300">
                  <CardIcon className="w-4 h-4" />
                </div>
              </div>

              {/* BOTTOM CONTENT */}
              <div className="relative z-10 space-y-3 pt-12">

                {/* Distance & Time Pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-green-300 font-light">
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-green-400" />
                    <span>Distance: {item.distance}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-green-400" />
                    <span>Time: {item.time}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold tracking-tight leading-snug text-white group-hover:text-emerald-200 transition-colors duration-200">
                  {item.title}
                </h3>

                {/* Small Description */}
                <p className="text-neutral-300 text-[0.82rem] font-light leading-relaxed line-clamp-3">
                  {item.description}
                </p>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default ThingsToDo;
