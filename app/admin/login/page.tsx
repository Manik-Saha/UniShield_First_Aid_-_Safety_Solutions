"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Cross } from "@/components/Cross";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8 font-display font-bold text-xl text-white">
          <span className="text-safety-red"><Cross size={20} /></span>
          UniShield Admin
        </div>

        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <h1 className="font-display font-bold text-xl text-ink mb-6">Sign in</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full border border-line rounded px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-safety-red"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-ink mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border border-line rounded px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-safety-red"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-safety-red">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-safety-red hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded transition-colors"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/40 mt-6 font-mono">
          UniShield First Aid & Safety — Admin Portal
        </p>
      </div>
    </div>
  );
}
