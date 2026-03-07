import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { BsCheckLg } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config";
import { BrandMark } from "../components/BrandMark";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to login");

      login(data.token, data.user);

      const next = searchParams.get("next");
      const safeNext =
        next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
      navigate(safeNext);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel flex flex-col items-center">
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-2.5 mb-6 hover:opacity-90 transition">
          <BrandMark inverse />
        </Link>

        {/* Title & Subtitle */}
        <h1 className="auth-title text-center">
          Welcome back
        </h1>
        <p className="auth-copy mt-1 mb-8 text-center">
          Log in to resume your active brainstorming boards
        </p>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="field-label">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="field-input"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label mb-0">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-link text-xs transition"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="field-input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#73869c] transition hover:text-white text-lg"
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          {/* Keep me signed in Checkbox */}
          <label className="flex items-center gap-2.5 mt-1 cursor-pointer select-none">
            <div
              onClick={() => setKeepSignedIn(!keepSignedIn)}
              className={`w-4 h-4 rounded flex items-center justify-center transition border ${
                keepSignedIn
                  ? "bg-[#ffdc45] border-[#ffdc45] text-[#102039]"
                  : "bg-[#071a2f] border-[#42627f]"
              }`}
            >
              {keepSignedIn && <BsCheckLg className="text-[10px]" />}
            </div>
            <span className="text-[11px] text-[#aebed4]">
              Keep me signed in on this device
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="primary-button mt-2 w-full"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-xs text-[#aebed4]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-link"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
