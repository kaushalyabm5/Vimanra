import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  MessageSquareText,
  Star,
  Images,
  ConciergeBell,
  BedDouble,
  Compass,
  Clock,
  X,
} from "lucide-react";
import { useCounts } from "../context/CountsContext";
// Tight crop of the carved Vimanra mark, so it still reads at 36px.
import logoMark from "../assets/logo-mark.jpg";

// `badge` names the key in the counts context whose value is shown as a pill.
const links = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/enquiries", label: "Enquiries", icon: MessageSquareText, badge: "enquiries" },
  { to: "/reviews", label: "Reviews", icon: Star, badge: "reviews" },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/facilities", label: "Facilities", icon: ConciergeBell },
  { to: "/rooms", label: "Rooms", icon: BedDouble },
  { to: "/things-to-do", label: "Things To Do", icon: Compass },
];

export default function Sidebar({ open, onClose }) {
  const { counts } = useCounts();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-ink/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-ink text-white z-40 flex flex-col flex-shrink-0
        transform transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img
              src={logoMark}
              alt="Vimanra"
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div>
              <p className="text-[16px] font-semibold tracking-tight leading-none">
                Vimanra<span className="text-brand-light">.</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-light/80 mt-1.5">Hotel Admin</p>
            </div>
          </div>
          <button className="lg:hidden text-white/60" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-none py-5 px-3.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/30 px-3 mb-2">Main Menu</p>
          <ul className="space-y-1">
            {links.map(({ to, label, icon: Icon, end, badge }) => {
              const count = badge ? counts[badge] : 0;
              return (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-full text-[13.5px] transition-colors relative
                      ${
                        isActive
                          ? "bg-white/[0.07] text-brand-on font-medium"
                          : "text-neutral-300 hover:bg-white/[0.04] hover:text-white font-light"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-brand-on" />
                        )}
                        <Icon size={17} strokeWidth={2} />
                        <span className="flex-1">{label}</span>
                        {count > 0 && (
                          <span
                            aria-label={`${count} awaiting attention`}
                            className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand-dark text-white text-[11px] font-semibold flex items-center justify-center shrink-0"
                          >
                            {count > 99 ? "99+" : count}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 mx-3.5 mb-4 rounded-2xl bg-ink-900/50 border border-ink-800/80">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 rounded-full bg-ink-900 border border-ink-800 text-[10px] text-neutral-300">
            <Clock className="w-3 h-3 text-brand-light shrink-0" />
            <span>Reception Open 24/7</span>
          </div>
          <p className="text-[11px] font-light text-neutral-400 leading-relaxed">
            Udawalawe · Sri Lanka<br />Lakeside · Kumbuk Garden
          </p>
        </div>
      </aside>
    </>
  );
}
