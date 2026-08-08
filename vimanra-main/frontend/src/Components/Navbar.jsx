import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, PhoneCall } from 'lucide-react';

// Square crop of the emblem from assets/images/logo.png — the full plate is a
// 2.7 MB portrait PNG, far too heavy for a nav bar mark.
import logoMark from '../assets/images/logo-mark.jpg';
import { BOOKING_LINK_PROPS } from '../config/booking';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Smooth section anchor links
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about-us' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Things To Do', href: '#things-to-do' },
  ];

  // Shadow & background density on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Simple active link tracker based on scroll position
      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Navbar Container */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center px-3 sm:px-6 pt-3 sm:pt-4 transition-all duration-300">
        <div
          className={`w-full max-w-5xl backdrop-blur-md border rounded-full px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? 'bg-white/95 border-neutral-200/90 shadow-xl shadow-neutral-900/5'
              : 'bg-white/85 border-white/60 shadow-lg shadow-neutral-900/5'
          }`}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2 text-neutral-900 font-medium text-lg sm:text-xl tracking-tight group shrink-0"
          >
            <img
              src={logoMark}
              alt="Vimanra Hotel"
              className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full object-cover ring-1 ring-neutral-900/10 shadow-sm transition-transform group-hover:scale-105 duration-200"
            />
            <span className="font-semibold text-neutral-950">Vimanra</span>
          </a>

          {/* Desktop / Large Screen Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-9 text-[0.85rem] font-medium text-neutral-800">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`transition-colors duration-200 py-1 whitespace-nowrap ${
                    isActive ? 'text-green-700 font-semibold' : 'hover:text-neutral-950'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:block shrink-0">
            <a
              {...BOOKING_LINK_PROPS}
              className="bg-green-700 hover:bg-green-800 text-white text-[0.85rem] font-light tracking-wide px-5 py-2 sm:px-6 sm:py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md inline-flex items-center gap-2 touch-manipulation whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white/90" />
              <span>Book Now</span>
            </a>
          </div>

          {/* Mobile & Tablet Drawer Trigger */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors touch-manipulation"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile & Tablet Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-2xl text-white flex flex-col justify-between p-6 sm:p-10 lg:hidden"
          >
            {/* Top Bar inside Drawer */}
            <div className="flex items-center justify-between max-w-2xl w-full mx-auto">
              <a
                href="#home"
                onClick={(e) => handleNavClick(e, '#home')}
                className="flex items-center gap-2 text-white font-semibold text-xl tracking-tight"
              >
                <img
                  src={logoMark}
                  alt="Vimanra Hotel"
                  className="w-10 h-10 shrink-0 rounded-full object-cover ring-1 ring-white/15"
                />
                <span>Vimanra</span>
              </a>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors touch-manipulation"
                aria-label="Close Navigation Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex flex-col items-center gap-6 sm:gap-8 my-auto text-center">
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.04 }}
                    className={`text-2xl sm:text-3xl tracking-wide transition-colors ${
                      isActive ? 'text-green-400 font-medium' : 'text-neutral-200 hover:text-green-400 font-light'
                    }`}
                  >
                    {link.name}
                  </motion.a>
                );
              })}
            </div>

            {/* Drawer CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-xs mx-auto mb-6"
            >
              <a
                {...BOOKING_LINK_PROPS}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-light text-base py-3.5 rounded-full shadow-lg hover:bg-green-500 transition-colors touch-manipulation"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Book Now</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}