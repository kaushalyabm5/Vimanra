import React, { useEffect, useMemo, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { fetchReviews } from '../../api/reviews';

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');

const Testimonials = () => {
  const [reviewRows, setReviewRows] = useState([]);

  useEffect(() => {
    fetchReviews().then(setReviewRows).catch(() => {});
  }, []);

  const testimonials = useMemo(
    () =>
      reviewRows
        .filter((r) => r.visible !== false)
        .map((r) => ({
          id: r.review_id,
          name: r.guest_name,
          source: r.source || 'Manual (Admin)',
          rating: r.rating,
          comment: r.review,
        })),
    [reviewRows]
  );

  // Duplicate list for seamless infinite looping
  const doubleTestimonials = [...testimonials, ...testimonials];

  if (testimonials.length === 0) return null;

  return (
    <section id='reviews' className="bg-white scroll-mt-20 py-2 max-w-full mx-auto text-neutral-900 overflow-hidden">

      {/* SECTION HEADER (CENTERED) */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 md:mb-20 px-6">

        {/* Small Pill Badge */}
        <div className="inline-block bg-neutral-100 border border-neutral-300/70 text-neutral-800 text-xs font-normal uppercase tracking-widest px-4 py-1.5 rounded-full">
          Guest Experiences
        </div>

        {/* Main Title */}
        <h2 className="text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-light text-neutral-950 tracking-tight leading-[1.12]">
          Stories From Our Guests
        </h2>

        {/* Main Description */}
        <p className="text-neutral-500 text-base sm:text-lg font-light leading-relaxed tracking-normal">
          Discover why travelers from around the world choose our tranquil sanctuary for their unforgettable Sri Lankan getaways.
        </p>

      </div>

      {/* SINGLE ROW MARQUEE CONTAINER */}
      <div className="relative w-full">
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused]">
            {doubleTestimonials.map((item, index) => (
              <div
                key={`testimonial-${item.id}-${index}`}
                className="w-[340px] sm:w-[380px] p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 flex-shrink-0"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-green-500">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-green-500 stroke-none" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-neutral-200" />
                  </div>

                  <p className="text-neutral-600 text-[0.92rem] font-normal leading-relaxed italic">
                    "{item.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-neutral-100">
                  <div className="w-11 h-11 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {initials(item.name)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 tracking-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs font-light text-neutral-400">
                      {item.source}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CUSTOM CSS FOR MARQUEE ANIMATION */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
      `}</style>

    </section>
  );
};

export default Testimonials;
