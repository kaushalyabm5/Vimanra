import { motion, useReducedMotion } from 'framer-motion';

// Compressed build of assets/images/splash.png — the source PNG is 2.7 MB,
// which would stall the very screen it is meant to fill.
import splashImg from '../assets/images/splash-screen.jpg';

const EASE = [0.16, 1, 0.3, 1];

// Feathers the crest artwork's rectangular edges into the backdrop so the
// baked-in vignette of splash.png blends instead of showing as a hard box.
const crestMask =
  'radial-gradient(ellipse 60% 55% at 50% 48%, #000 44%, rgba(0,0,0,0.5) 72%, transparent 100%)';

// Fine film grain, inlined as a data URI so the splash never waits on a
// network request to finish rendering itself.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

const TAGLINE = 'UDAWALAWE · SRI LANKA';

export default function SplashScreen() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
      transition={{ duration: 0.8, ease: EASE }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-[#070908]"
    >
      {/* Two slow-drifting light pools give the flat backdrop some depth. */}
      {!reduced && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute h-[70vmax] w-[70vmax] rounded-full opacity-70"
            style={{
              background:
                'radial-gradient(circle, rgba(201,162,92,0.16), transparent 62%)',
              filter: 'blur(40px)',
            }}
            animate={{ x: ['-12%', '10%', '-12%'], y: ['-8%', '6%', '-8%'] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute h-[55vmax] w-[55vmax] rounded-full opacity-60"
            style={{
              background:
                'radial-gradient(circle, rgba(28,90,58,0.20), transparent 64%)',
              filter: 'blur(50px)',
            }}
            animate={{ x: ['14%', '-8%', '14%'], y: ['10%', '-6%', '10%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Warm key light centred on the crest itself */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 44%, rgba(224,189,122,0.16), transparent 58%)',
        }}
      />

      {/* Crest */}
      <motion.img
        src={splashImg}
        alt="Vimanra Hotel"
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.3, ease: EASE }}
        className="relative h-[32vh] max-h-[310px] w-auto select-none object-contain sm:h-[36vh]"
        style={{ maskImage: crestMask, WebkitMaskImage: crestMask }}
        draggable={false}
      />

      {/* Tagline, revealed letter by letter */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: reduced ? 0 : 0.035, delayChildren: 0.45 } },
        }}
        className="relative -mt-1 flex items-center gap-3.5"
      >
        <motion.span
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          transition={{ duration: 0.7, ease: EASE }}
          className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-[#c9a25c]/60"
        />
        <p className="flex text-[10px] font-light uppercase tracking-[0.42em] text-[#d8b878]">
          {TAGLINE.split('').map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
        </p>
        <motion.span
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          transition={{ duration: 0.7, ease: EASE }}
          className="h-px w-10 origin-left bg-gradient-to-l from-transparent to-[#c9a25c]/60"
        />
      </motion.div>

      {/* Hairline loading sweep, pinned to the foot of the screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute bottom-0 left-0 h-px w-full overflow-hidden bg-white/[0.06]"
      >
        <motion.div
          className="h-full w-1/4 bg-gradient-to-r from-transparent via-[#e0bd7a] to-transparent"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Grain sits above everything to bind the layers together */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
    </motion.div>
  );
}
