import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// Same property shot the public site opens on, so staff land on the real hotel.
import loginHero from "../assets/login-hero.png";
import logoMark from "../assets/logo-mark.jpg";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(username, password);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-ink">
      {/* Left / brand panel */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${loginHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/50" />

        <div className="relative flex items-center gap-3">
          <img src={logoMark} alt="Vimanra" className="w-11 h-11 rounded-full object-cover shrink-0" />
          <div>
            <p className="text-white text-xl font-semibold tracking-tight leading-none">
              Vimanra<span className="text-brand-light">.</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-brand-light/80 mt-1.5">Hotel Admin</p>
          </div>
        </div>

        <div className="relative">
          <p className="text-brand-light text-xs font-medium uppercase tracking-[0.2em] mb-3">Udawalawe · Sri Lanka</p>
          <h2 className="text-white text-4xl font-normal tracking-tight leading-[1.15] max-w-sm">
            Manage guest reviews, enquiries and content from one lakeside dashboard.
          </h2>
          <p className="text-neutral-400 text-sm font-light mt-4 max-w-sm leading-relaxed">
            Built for the Vimanra front-desk team — reviews, enquiries and
            content, all in one governed place.
          </p>
        </div>
      </div>

      {/* Right / form panel */}
      <div className="flex-1 flex items-center justify-center bg-surface p-6">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center gap-2.5 justify-center mb-8">
            <img src={logoMark} alt="Vimanra" className="w-10 h-10 rounded-full object-cover shrink-0" />
            <div>
              <p className="text-ink text-lg font-semibold tracking-tight leading-none">
                Vimanra<span className="text-brand">.</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand mt-1.5">Hotel Admin</p>
            </div>
          </div>

          <div className="inline-block bg-ink-100 border border-ink-200 text-ink-700 text-[10px] font-normal uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
            Staff Access
          </div>
          <h1 className="text-3xl font-normal tracking-tight text-ink">Welcome back</h1>
          <p className="text-ink-500 text-sm font-light mt-1.5 mb-8">Sign in to the Vimanra admin dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-ink-200 bg-card text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-ink-200 bg-card text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-[12.5px] text-danger bg-danger/10 border border-danger/15 rounded-xl px-3.5 py-2.5">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-[12.5px] pt-1">
              <label className="flex items-center gap-2 text-ink-600 cursor-pointer">
                <input type="checkbox" className="accent-brand w-3.5 h-3.5" />
                Keep me signed in
              </label>
              <button type="button" className="text-brand-dark font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-[13.5px]"
            >
              {loading ? "Signing in…" : "Sign in to dashboard"}
            </button>
          </form>

          <div className="mt-6 flex items-start gap-2.5 bg-brand/10 border border-brand/20 rounded-xl px-4 py-3">
            <ShieldCheck size={16} className="text-brand-dark mt-0.5 shrink-0" />
            <p className="text-[11.5px] text-ink-600 leading-relaxed">
              Demo credentials — Username: <span className="font-medium text-ink">admin</span> · Password:{" "}
              <span className="font-medium text-ink">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
