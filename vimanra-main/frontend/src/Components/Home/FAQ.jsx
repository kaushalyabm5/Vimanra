import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqsData = [
  {
    id: 'faq-1',
    question: 'What time is check-in?',
    answer: 'Check-in begins at 2:00 PM.',
  },
  {
    id: 'faq-2',
    question: 'What time is check-out?',
    answer: 'Check-out is until 11:00 AM – 12:00 PM.',
  },
  {
    id: 'faq-3',
    question: 'Is breakfast included?',
    answer: 'Yes, selected room packages include complimentary breakfast.',
  },
  {
    id: 'faq-4',
    question: 'Do you arrange safari tours?',
    answer: 'Yes. We can arrange guided jeep safaris to Udawalawe National Park.',
  },
  {
    id: 'faq-5',
    question: 'Is parking available?',
    answer: 'Yes, complimentary free parking is available for all guests.',
  },
  {
    id: 'faq-6',
    question: 'Do you provide airport transfers?',
    answer: 'Yes, airport transportation can be arranged upon request.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0); // Opens first item by default

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-white py-24 md:py-36 px-4 sm:px-6 md:px-12 text-neutral-900 border-t border-neutral-100">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14 md:mb-20">
          <div className="inline-block bg-neutral-100 border border-neutral-300/70 text-neutral-800 text-xs font-normal uppercase tracking-widest px-4 py-1.5 rounded-full">
          
            Common Questions
          </div>

          <h2 className="text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-light text-neutral-950 tracking-tight leading-[1.12]">
            Frequently Asked Questions
          </h2>

          <p className="text-neutral-500 text-base sm:text-lg font-light leading-relaxed">
            Everything you need to know about your stay, check-in, safari tours, and resort amenities.
          </p>
        </div>

        {/* ACCORDION CONTAINER */}
        <div className="space-y-4">
          {faqsData.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                onClick={() => toggleAccordion(index)}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
                  isOpen
                    ? 'border-green-500/40 bg-green-50/20 shadow-md shadow-green-900/5'
                    : 'border-neutral-200/80 hover:border-green-500/30 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-medium text-neutral-950 tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 p-1.5 rounded-full border transition-transform duration-300 cursor-pointer ${
                      isOpen
                        ? 'bg-green-500 text-white border-green-500 rotate-180 shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-6 pb-7 sm:px-7 sm:pb-8 text-neutral-600 text-sm sm:text-base font-light leading-relaxed border-t border-green-500/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;