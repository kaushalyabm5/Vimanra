import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AccountSettingsModal from "./AccountSettingsModal";

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { admin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = admin?.name
    ? admin.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : "AD";

  return (
    <header className="sticky top-0 z-20 bg-surface/85 backdrop-blur-md border-b border-ink-200/70">
      <div className="flex items-center justify-between gap-4 px-5 lg:px-8 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden shrink-0 w-9 h-9 rounded-full bg-white border border-ink-200 flex items-center justify-center text-ink-800 hover:bg-ink-100 transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg lg:text-xl font-semibold text-ink tracking-tight truncate">{title}</h1>
            {subtitle && <p className="text-xs font-light text-ink-500 mt-0.5 truncate">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-ink-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-semibold">
                {initials}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-[13px] font-medium text-ink">{admin?.name || "Admin"}</p>
                <p className="text-[11px] font-light text-ink-500">{admin?.role || "Hotel Admin"}</p>
              </div>
              <ChevronDown size={14} className="text-ink-400 hidden sm:block" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-card border border-ink-200/70 py-1.5 animate-fade-in">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setSettingsOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-ink-600 hover:bg-ink-100 transition-colors"
                >
                  <Settings size={15} /> Account settings
                </button>
                <div className="h-px bg-ink-200/70 my-1" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-danger hover:bg-danger/5 transition-colors"
                >
                  <LogOut size={15} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AccountSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  );
}
