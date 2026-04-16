"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Check, X } from "lucide-react";

function StrengthRule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? "text-emerald-400" : "text-gray-600"}`}>
      {ok ? <Check size={11} /> : <X size={11} />}
      {text}
    </li>
  );
}

function getStrengthLevel(p: string): { level: number; label: string; color: string } {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score <= 2) return { level: score, label: "Weak", color: "#ef4444" };
  if (score === 3) return { level: score, label: "Fair", color: "#f97316" };
  if (score === 4) return { level: score, label: "Good", color: "#eab308" };
  return { level: score, label: "Strong", color: "#22c55e" };
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const strength = getStrengthLevel(form.newPass);
  const rules = [
    { ok: form.newPass.length >= 8, text: "At least 8 characters" },
    { ok: /[A-Z]/.test(form.newPass), text: "One uppercase letter" },
    { ok: /[a-z]/.test(form.newPass), text: "One lowercase letter" },
    { ok: /[0-9]/.test(form.newPass), text: "One number" },
    { ok: /[^A-Za-z0-9]/.test(form.newPass), text: "One special character" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.current,
          newPassword: form.newPass,
          confirmPassword: form.confirm,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, msg: "Password changed successfully!" });
        setForm({ current: "", newPass: "", confirm: "" });
      } else {
        setResult({ ok: false, msg: data.error || "Something went wrong." });
      }
    } catch {
      setResult({ ok: false, msg: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your admin account</p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-6 lg:p-8"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.2)" }}
          >
            <KeyRound size={18} className="text-brand-pink" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Change Password</p>
            <p className="text-gray-600 text-xs">Use a strong password with mixed characters</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current password */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={show.current ? "text" : "password"}
                value={form.current}
                onChange={(e) => setForm((f) => ({ ...f, current: e.target.value }))}
                required
                autoComplete="current-password"
                className="input-luxury w-full pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {show.current ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={show.newPass ? "text" : "password"}
                value={form.newPass}
                onChange={(e) => setForm((f) => ({ ...f, newPass: e.target.value }))}
                required
                autoComplete="new-password"
                className="input-luxury w-full pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, newPass: !s.newPass }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {show.newPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Strength bar */}
            {form.newPass.length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5 flex-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background: i <= strength.level ? strength.color : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-1">
                  {rules.map((r) => (
                    <StrengthRule key={r.text} ok={r.ok} text={r.text} />
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input
                type={show.confirm ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                required
                autoComplete="new-password"
                className="input-luxury w-full pr-10"
                placeholder="Repeat new password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.confirm.length > 0 && form.newPass !== form.confirm && (
              <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Result */}
          {result && (
            <div
              className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
                result.ok
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {result.ok ? <Check size={15} className="mt-0.5 shrink-0" /> : <X size={15} className="mt-0.5 shrink-0" />}
              {result.msg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || rules.some((r) => !r.ok) || form.newPass !== form.confirm}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-pink disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{ background: "linear-gradient(135deg, #E91E8C, #FF2D9B)" }}
          >
            {loading ? "Changing Password…" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
