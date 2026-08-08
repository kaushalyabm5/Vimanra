import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchReviews } from '../../api/reviews';

const DURATION = 1800;

/** Counts 0 → target once `active` flips true, then holds. */
function useCountUp(target, active) {
  // Someone who asked the OS for less motion still needs the number, so they
  // get the final figure outright rather than an animation.
  const [reduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / DURATION);
      // easeOutCubic: fast at first, so the final digits settle rather than crawl.
      setAnimated(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, reduced]);

  return reduced ? target : animated;
}

const StatCard = ({ stat, active }) => {
  const value = useCountUp(stat.value, active);

  return (
    <div className="bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-2xl px-4 py-8 sm:py-10 text-center flex flex-col items-center justify-center">
      <p className="text-4xl sm:text-5xl font-bold tracking-tight text-white tabular-nums">
        {value.toLocaleString('en-US')}
        {stat.suffix}
      </p>
      <p className="mt-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-green-400 leading-relaxed max-w-[15ch]">
        {stat.label}
      </p>
    </div>
  );
};

const StatsBand = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [satisfaction, setSatisfaction] = useState(null);

  // The public /reviews endpoint returns approved reviews only, so this is the
  // same set of ratings a visitor can read in the Testimonials section.
  useEffect(() => {
    fetchReviews()
      .then((rows) => {
        if (!rows.length) return;
        const average = rows.reduce((sum, r) => sum + r.rating, 0) / rows.length;
        setSatisfaction(Math.round((average / 5) * 100));
      })
      .catch(() => {});
  }, []);

  // The satisfaction card is dropped rather than shown with an invented figure
  // when there are no reviews yet, or the request fails.
  const stats = useMemo(
    () =>
      [
        { value: 5000, suffix: '+', label: 'Satisfied Customers' },
        { value: 10, suffix: '+', label: 'Years of Experience' },
        satisfaction !== null && {
          value: satisfaction,
          suffix: '%',
          label: 'Customer Satisfaction Rate',
        },
        { value: 100, suffix: '%', label: 'Safety Record' },
      ].filter(Boolean),
    [satisfaction]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Count once, not on every scroll past.
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl"
    >
      <img
        src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-neutral-950/88" />
      <div className="absolute inset-0 bg-green-950/30" />

      <div
        className={`relative z-10 grid grid-cols-2 gap-3.5 sm:gap-5 p-5 sm:p-8 md:p-12 ${
          stats.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        }`}
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} active={inView} />
        ))}
      </div>
    </div>
  );
};

export default StatsBand;
