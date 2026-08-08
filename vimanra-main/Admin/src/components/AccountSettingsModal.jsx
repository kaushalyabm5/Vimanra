import { useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { changePassword } from "../api";

const MIN_LENGTH = 8;
const emptyForm = { current: "", next: "", confirm: "" };

export default function AccountSettingsModal({ open, onClose }) {
  const { admin } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const close = () => {
    setForm(emptyForm);
    setError("");
    setNotice("");
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    // Checked here as well as on the server so a typo costs no round trip.
    if (form.next.length < MIN_LENGTH) {
      setError(`The new password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (form.next !== form.confirm) {
      setError("The new passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const message = await changePassword(form.current, form.next);
      setNotice(message);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const field =
    "w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all";

  return (
    <Modal open={open} onClose={close} title="Account settings">
      <div className="space-y-5">
        <div className="flex items-center gap-3 bg-surface rounded-xl p-3.5">
          <div className="w-9 h-9 rounded-full bg-brand-dark text-white flex items-center justify-center shrink-0">
            <ShieldCheck size={17} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-ink truncate">{admin?.username || "Admin"}</p>
            <p className="text-[11.5px] text-ink-500 truncate">{admin?.email || "Hotel Admin"}</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label">Current password</label>
            <input
              type={show ? "text" : "password"}
              value={form.current}
              onChange={(e) => setForm((f) => ({ ...f, current: e.target.value }))}
              className={field}
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <label className="field-label">New password</label>
            <input
              type={show ? "text" : "password"}
              value={form.next}
              onChange={(e) => setForm((f) => ({ ...f, next: e.target.value }))}
              className={field}
              autoComplete="new-password"
              required
            />
            <p className="text-[11.5px] text-ink-400 mt-1.5">At least {MIN_LENGTH} characters.</p>
          </div>

          <div>
            <label className="field-label">Confirm new password</label>
            <input
              type={show ? "text" : "password"}
              value={form.confirm}
              onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
              className={field}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="flex items-center gap-1.5 text-[12px] font-medium text-ink-500 hover:text-ink transition-colors"
          >
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
            {show ? "Hide passwords" : "Show passwords"}
          </button>

          {error && <p className="text-danger text-[12.5px]">{error}</p>}
          {notice && <p className="text-brand-dark text-[12.5px]">{notice}</p>}

          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Updating…" : "Update password"}
            </button>
            <button type="button" onClick={close} className="btn-ghost">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
