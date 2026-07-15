"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          router.push("/admin/dashboard");
        }
      })
      .catch((err) => console.error(err));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-warm-primary/10 blur-[90px] animate-pulse duration-[8000ms] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-warm-secondary/10 blur-[100px] animate-pulse duration-[6000ms] pointer-events-none" />

      <div className="w-full max-w-xl bg-[#F9F6EE] border border-warm-border/60 rounded-3xl p-12 md:p-14 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-warm-primary/10 border border-warm-primary/20 text-warm-primary">
            <Wrench className="h-12 w-12" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-wide">
            Avorex Portal
          </h2>
          <p className="text-sm md:text-base text-warm-muted font-bold tracking-wider uppercase">
            Admin Authentication
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-5 mb-6 text-sm font-bold text-red-700 bg-red-50 border border-red-100 rounded-2xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-warm-muted uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-warm-muted">
                <Mail className="h-5.5 w-5.5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@avorex.com"
                className="w-full bg-white pl-14 pr-6 py-4.5 rounded-2xl border border-warm-border/60 focus:outline-none focus:border-warm-primary text-base font-semibold transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-warm-muted uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-warm-muted">
                <Lock className="h-5.5 w-5.5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white pl-14 pr-6 py-4.5 rounded-2xl border border-warm-border/60 focus:outline-none focus:border-warm-primary text-base font-semibold transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 mt-4 bg-gradient-to-r from-warm-secondary to-warm-primary text-white rounded-2xl text-sm md:text-base font-black uppercase tracking-wider shadow-lg hover:shadow-warm-primary/15 transition-all flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>{loading ? "Authenticating..." : "Login"}</span>
            <ArrowRight className="h-5 w-5 stroke-[2.5]" />
          </button>
        </form>

        <div className="text-center mt-8">
          <a
            href="/"
            className="text-xs md:text-sm font-bold text-warm-muted hover:text-warm-primary tracking-wide uppercase transition-colors"
          >
            ← Back to Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
