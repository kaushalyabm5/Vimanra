import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

/**
 * Centred confirmation dialog used in place of window.alert(), which renders
 * at the top of the browser chrome and cannot be styled.
 */
const MessageDialog = ({ open, type = 'success', title, message, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;
  const accent = isSuccess ? 'text-green-500' : 'text-red-500';
  const accentBg = isSuccess ? 'bg-green-500/10' : 'bg-red-500/10';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm font-sans"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl px-7 py-8 text-center"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-neutral-500 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${accentBg}`}>
              <Icon className={`w-6 h-6 ${accent}`} />
            </div>

            <h3 className="mt-4 text-base font-medium tracking-tight text-white">{title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-400">{message}</p>

            <button
              onClick={onClose}
              autoFocus
              className="mt-6 w-full cursor-pointer bg-green-500 hover:bg-green-600 text-white text-xs font-medium tracking-wide py-2.5 px-4 rounded-xl transition-all duration-300 shadow-md shadow-green-500/20 active:scale-[0.99]"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageDialog;
