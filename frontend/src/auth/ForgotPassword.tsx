import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config';
import { HiOutlineKey } from 'react-icons/hi';
import { HiArrowLeft } from 'react-icons/hi2';
import { BsCheck2 } from 'react-icons/bs';
import { Oval } from 'react-loader-spinner';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset link');

      setIsSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-page">
        <div className="auth-panel flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-2xl mb-6">
            <BsCheck2 className="stroke-1" />
          </div>
          <h1 className="auth-title mb-2">
            Check your inbox
          </h1>
          <p className="auth-copy mb-8 max-w-[320px]">
            If an account exists for <span className="font-semibold text-white">{email}</span>, you will receive a temporary password recovery link shortly.
          </p>
          <Link
            to="/login"
            className="primary-button w-full"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-panel flex flex-col items-center text-center">
        
        {/* Key Icon Badge */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md border border-[#315475] bg-[#071a2f] text-2xl text-[#51a9ff]">
          <HiOutlineKey className="-rotate-45" />
        </div>

        {/* Title */}
        <h1 className="auth-title">
          Reset your password
        </h1>

        {/* Subtitle */}
        <p className="auth-copy mt-2 mb-8 max-w-[340px]">
          Enter the email registered with your account and we will send a temporary password recovery link.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 text-left">
          <div>
            <label className="field-label">
              Registered Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="field-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-button mt-1 w-full"
          >
            {loading ? (
              <Oval
                visible={true}
                height="18"
                width="18"
                color="#ffffff"
                secondaryColor="#79a7ff"
                strokeWidth={4}
                strokeWidthSecondary={4}
                ariaLabel="oval-loading"
              />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Back to sign in link */}
        <Link
          to="/login"
          className="text-link group mt-7 flex items-center gap-2 text-xs transition"
        >
          <HiArrowLeft className="text-sm group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to sign in</span>
        </Link>

      </div>
    </div>
  );
};

export default ForgotPassword;