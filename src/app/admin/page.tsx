"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        toast.error("Incorrect password. Try again.");
        return;
      }

      toast.success("Welcome back!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 hero-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)" }} />

      <div className="relative w-full max-w-md">
        <div className="card-glass p-8 rounded-3xl shadow-luxury">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-brand-gold/30 mb-4">
              <Image src="/logo.png" alt="BeeQueen of Kashmir" fill sizes="64px" priority className="object-cover" />
            </div>
            <p className="text-white font-bold text-lg font-display">Admin Panel</p>
            <p className="text-gray-600 text-xs tracking-widest uppercase mt-1">BeeQueen of Kashmir</p>
          </div>

          {/* Lock icon */}
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.2)" }}>
            <Lock size={20} className="text-brand-pink" />
          </div>

          <h1 className="text-center text-white font-semibold text-xl mb-1">Secure Access</h1>
          <p className="text-center text-gray-600 text-sm mb-8">Enter the admin password to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden username field for password manager accessibility */}
            <input type="text" name="username" autoComplete="username" className="hidden" aria-hidden="true" tabIndex={-1} readOnly value="admin" />
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="input-luxury w-full px-4 py-3 text-sm pr-12"
                autoComplete="current-password"
                suppressHydrationWarning
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                suppressHydrationWarning
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="pink"
              size="lg"
              fullWidth
              loading={loading}
            >
              <span>Access Dashboard</span>
            </Button>
          </form>

          <p className="text-center text-xs text-gray-700 mt-6">
            This area is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}
