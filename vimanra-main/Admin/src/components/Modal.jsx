import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, width = "max-w-lg" }) {
  // Hold the page still underneath, so scrolling inside the modal cannot bleed
  // through to the list behind it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  // Rendered into <body> rather than in place. Topbar's header carries
  // `backdrop-blur`, and a backdrop-filter ancestor becomes the containing
  // block for position:fixed children — left inline, this panel would be
  // positioned against the ~70px header and sit half off the top of the
  // screen. The portal also escapes the header's z-20 stacking context.
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
      <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />

      {/* min-h-full lets the row grow past the viewport when the panel is tall,
          so a long form scrolls into reach instead of being clipped. */}
      <div className="relative flex min-h-full items-start justify-center px-4 pt-[8vh] pb-10">
        <div
          className={`relative bg-card w-full ${width} rounded-3xl shadow-card animate-fade-in max-h-[84vh] flex flex-col`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink-200/70 shrink-0">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
            >
              <X size={17} />
            </button>
          </div>
          {/* min-h-0 is what actually lets this scroll: without it a flex child
              refuses to shrink below its content height. */}
          <div className="px-6 py-5 overflow-y-auto min-h-0">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
