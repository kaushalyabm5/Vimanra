import React from 'react';
import { 
  Waves, 
  Compass, 
  BedDouble, 
  Sparkles, 
  UtensilsCrossed,
  HeartHandshake
} from 'lucide-react';
import StatsBand from './StatsBand';

// Property photography. Extensions reflect each file's real encoding — several
// were originally mislabelled (WebP named .jpg, AVIF named .jpg).
import riverImg from '../../assets/images/choose/river.avif';
import roomImg from '../../assets/images/choose/room.JPG';
import poolImg from '../../assets/images/choose/pool.webp';
import diningImg from '../../assets/images/choose/dining.jpg';
import serviceImg from '../../assets/images/choose/free.webp';

const features = [
  {
    id: '01',
    category: 'LOCATION',
    title: 'Peaceful Riverside Location',
    description: 'Wake up to the gentle rhythm of nature, serene water views, and pristine tropical greenery surrounding your stay.',
    icon: Waves,
    bgImage: riverImg,
  },
  {
    id: '02',
    category: 'SAFARI ACCESS',
    title: 'Just Minutes from Udawalawe Park',
    description: 'Effortless proximity to Sri Lanka’s premier wild elephant sanctuary and unforgettable safari adventures.',
    icon: Compass,
    bgImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '03',
    category: 'STAY',
    title: 'Comfortable Accommodation',
    description: 'Elegantly appointed rooms designed with modern premium amenities and organic natural accents.',
    icon: BedDouble,
    bgImage: roomImg,
  },
  {
    id: '04',
    category: 'RELAXATION',
    title: 'Infinity Swimming Pool',
    description: 'Unwind and refresh beside our scenic outdoor swimming pool overlooking lush scenic landscapes.',
    icon: Sparkles,
    bgImage: poolImg,
  },
  {
    id: '05',
    category: 'CUISINE',
    title: 'Delicious Dining',
    description: 'Savor authentic Sri Lankan specialties alongside international delicacies, freshly crafted by our chefs.',
    icon: UtensilsCrossed,
    bgImage: diningImg,
  },
  {
    id: '06',
    category: 'HOSPITALITY',
    title: 'Personalized Service',
    description: 'Warm, intuitive staff dedicated to ensuring every moment of your stay is effortlessly memorable.',
    icon: HeartHandshake,
    bgImage: serviceImg,
  },
];

const WhyStayWithUs = () => {
  return (
    <section id="why-stay-with-us" className="w-full py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12 bg-white text-neutral-900 selection:bg-neutral-950 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-14 md:mb-16">
          <div className="inline-block bg-neutral-100 border border-neutral-300/70 text-neutral-800 text-xs font-normal uppercase tracking-widest px-4 py-1.5 rounded-full">
            Udawalawe • Sri Lanka
          </div>

          <h2 className="text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-light text-neutral-950 tracking-tight leading-[1.15]">
            Why Stay With Us
          </h2>

          <p className="text-neutral-500 text-sm sm:text-base md:text-lg font-light leading-relaxed tracking-normal px-2">
            Immerse yourself in a sanctuary where undisturbed riverfront nature, refined comfort, and authentic Sri Lankan hospitality gracefully align.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="group relative min-h-[420px] p-8 sm:p-10 bg-neutral-950 text-white overflow-hidden flex flex-col justify-between border border-neutral-200/20 hover:border-emerald-500/50 transition-all duration-500 shadow-xl rounded-3xl"
              >
                {/* Individual Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-50 group-hover:opacity-65 rounded-3xl"
                  style={{ backgroundImage: `url(${item.bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40 rounded-3xl" />

                {/* Card Top Content */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-white uppercase bg-green-500 px-3.5 py-1.5 rounded-full shadow-md">
                    {item.category}
                  </span>
                  <div className="p-3 bg-green-500 text-white transition-all duration-300 rounded-2xl shadow-md group-hover:scale-110">
                    <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Card Bottom Content */}
                <div className="relative z-10 space-y-3 pt-12">
                  <h3 className="text-2xl font-light tracking-tight text-white group-hover:translate-x-1 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <p className="text-neutral-300 text-sm font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated stat counters, in place of the old booking banner */}
        <StatsBand />

      </div>
    </section>
  );
};

export default WhyStayWithUs;