import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ArrowUpRight,
  Navigation,
  Globe
} from 'lucide-react';
import { API_BASE_URL } from '../api/client';
import { BOOKING_URL } from '../config/booking';
import MessageDialog from './MessageDialog';

// Custom SVG Icons for Brands (Lucide does not export brand logos)
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [dialog, setDialog] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, channel: 'Contact Form' }),
      });
      if (!res.ok) throw new Error('Request failed');
      setDialog({
        type: 'success',
        title: 'Thank you for reaching out',
        message: 'We have received your message and will contact you shortly.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setDialog({
        type: 'error',
        title: 'Message not sent',
        message: 'Something went wrong sending your message. Please try again, or call us directly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'Dining', href: '#dining' },
    { name: 'Safari', href: '#safari' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon },
    { name: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
    { name: 'TripAdvisor', href: 'https://tripadvisor.com', icon: Globe },
    { name: 'Booking.com', href: BOOKING_URL, icon: Globe },
  ];

  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-10 px-4 sm:px-6 md:px-12 border-t border-neutral-900/80 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* UPPER GRID: BRAND, NAVIGATION & CONTACT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-neutral-800/60">
          
          {/* BRAND COLUMN */}
          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-tight text-white">
                Vimanra<span className="text-green-500 font-semibold">.</span>
              </h2>
              <p className="text-xs uppercase tracking-widest text-green-500 font-medium">
                Resort & Safari Udawalawe
              </p>
            </div>

            <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Experience natural elegance and luxury at Vimanra Udawalawe. Surrounded by tranquil waters, rich wildlife, and peaceful jungle ambiance.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-green-500 shrink-0" />
              <span>Reception Open 24/7</span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-200">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-xs text-neutral-400 hover:text-green-500 font-light transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div id="contact" className="lg:col-span-3 space-y-4 scroll-mt-28">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-200">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs text-neutral-300 font-light">
                <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Prajashalawa Road, 97 1/2, Thibolketiya, Udawalawe, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-300 font-light">
                <Phone className="w-4 h-4 text-green-500 shrink-0" />
                <a href="tel:+94777909802" className="hover:text-green-400 transition-colors">+94 77 790 9802</a>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-300 font-light">
                <Mail className="w-4 h-4 text-green-500 shrink-0" />
                <a href="mailto:info@vimanra.com" className="hover:text-green-400 transition-colors">info@vimanra.com</a>
              </div>
            </div>
          </div>

          {/* FOLLOW US */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-200">
              Follow Us
            </h3>
            <ul className="grid grid-cols-2 gap-2.5">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <li key={idx}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-neutral-900/0 text-xs text-neutral-300 hover:text-white hover:border-green-500/50 hover:bg-neutral-900 transition-all duration-300 flex items-center gap-2 group"
                    >
                      <Icon className="w-3.5 h-3.5 text-green-500 group-hover:scale-110 transition-transform" />
                      <span className="truncate font-light">{social.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        {/* LOWER SECTION: MAP & QUICK INQUIRY SIDE-BY-SIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* MAP CARD */}
          <div className="lg:col-span-6 bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-200">
                  Location Map
                </h3>
                <p className="text-[11px] text-neutral-400 font-light">Thibolketiya near Udawalawe Reservoir</p>
              </div>
              <a
                href="https://maps.google.com/?q=Vimanra+Udawalawa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-500 hover:text-green-400 flex items-center gap-1 font-medium transition-colors"
              >
                <span>Directions</span>
                <Navigation className="w-3 h-3" />
              </a>
            </div>

            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-900 group">
              <iframe
                title="Vimanra Udawalawe Location Map"
                src="https://maps.google.com/maps?q=Vimanra%20Udawalawa&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="w-full h-full opacity-85 group-hover:opacity-100 transition-opacity duration-500"
              />
              <a
                href="https://maps.google.com/?q=Vimanra+Udawalawa"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2.5 right-2.5 bg-neutral-950/90 backdrop-blur-md hover:bg-green-600 text-white text-[10px] font-light px-3 py-1.5 rounded-lg border border-neutral-700/60 shadow-lg flex items-center gap-1.5 transition-all duration-300"
              >
                <MapPin className="w-3 h-3 text-green-400 group-hover:text-white" />
                <span>Open Pin</span>
              </a>
            </div>
          </div>

          {/* INQUIRY FORM CARD */}
          <div className="lg:col-span-6 bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 backdrop-blur-xs">
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-200">
                Quick Inquiry
              </h3>
              <p className="text-[11px] text-neutral-400 font-light">Send us a direct message or booking request</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-green-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-colors duration-200"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-green-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-colors duration-200"
                />
              </div>
              <textarea
                rows="2"
                placeholder="Message or Booking request..."
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-green-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-colors duration-200 resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full cursor-pointer bg-green-500 hover:bg-green-600 text-white text-xs font-medium tracking-wide py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-green-500/20 active:scale-[0.99] disabled:opacity-70"
              >
                <span>{submitting ? 'Sending…' : 'Send Message'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-light text-neutral-500 gap-3 text-center sm:text-left">
          <p>© 2026 Vimanra Udawalawe. All Rights Reserved.</p>
          <div className="flex items-center gap-5 text-neutral-400">
            <a href="#" className="hover:text-green-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-green-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-green-500 transition-colors">Cookie Settings</a>
          </div>
        </div>

      </div>

      <MessageDialog
        open={dialog !== null}
        type={dialog?.type}
        title={dialog?.title}
        message={dialog?.message}
        onClose={() => setDialog(null)}
      />
    </footer>
  );
};

export default Footer;