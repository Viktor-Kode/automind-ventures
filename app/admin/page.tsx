"use client";

import { useState, useEffect } from "react";
import AdminTable from "../../components/AdminTable";
import { Lock, Loader2, Eye, EyeOff, AlertCircle, Wrench } from "lucide-react";
import { Applicant } from "../../lib/sheets";

const SESSION_KEY = "gbt_admin_auth";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authedPassword, setAuthedPassword] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  // Check sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      fetchApplicants(saved);
    }
  }, []);

  const fetchApplicants = async (pw: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/get-applicants", {
        headers: { Authorization: `Bearer ${pw}` }
      });
      if (res.status === 401) {
        setAuthError("Incorrect password. Please try again.");
        sessionStorage.removeItem(SESSION_KEY);
        return;
      }
      const data = await res.json();
      sessionStorage.setItem(SESSION_KEY, pw);
      setAuthedPassword(pw);
      setApplicants(data.rows ?? []);
    } catch {
      setAuthError("Failed to connect. Check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    await fetchApplicants(password.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthedPassword(null);
    setApplicants([]);
    setPassword("");
  };

  // ===== AUTHENTICATED =====
  if (authedPassword) {
    return (
      <div className="max-w-full px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-5 h-5 text-[#F5A623]" />
              <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
            </div>
            <p className="text-white/40 text-sm">
              GearboxTraining — Applicant Management
            </p>
          </div>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-white/20 text-white/50 hover:text-white hover:border-white/40 text-sm transition-all"
          >
            Logout
          </button>
        </div>

        <AdminTable
          initialApplicants={applicants}
          adminPassword={authedPassword}
        />
      </div>
    );
  }

  // ===== PASSWORD GATE =====
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#F5A623]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#F5A623]" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">GearboxTraining — Restricted Area</p>
        </div>

        <form
          id="admin-login-form"
          onSubmit={handleLogin}
          className="card space-y-4"
        >
          {authError && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{authError}</p>
            </div>
          )}

          <div>
            <label htmlFor="admin-password" className="form-label">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authError) setAuthError(null);
                }}
                className="form-input pl-10 pr-10"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading || !password.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Access Dashboard →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
