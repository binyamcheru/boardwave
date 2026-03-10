import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HiOutlineKey, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { BsCheck2 } from 'react-icons/bs';
import { Oval } from 'react-loader-spinner';
import { API_BASE } from '../config';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      setIsSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-panel flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/80 flex items-center justify-center text-red-400 text-2xl mb-6">
            ✕
          </div>
          <h1 className="auth-title mb-2">
            Invalid Link
          </h1>
          <p className="auth-copy mb-8">
            This password reset link is missing a security token or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="primary-button w-full"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-panel flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-2xl mb-6">
            <BsCheck2 className="stroke-1" />
          </div>
          <h1 className="auth-title mb-2">
            Password Reset Complete
          </h1>
          <p className="auth-copy mb-8">
            Your password has been successfully updated. You can now log in with your new credentials.
          </p>
          <Link
            to="/login"
            className="primary-button w-full"
          >
            Proceed to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-panel flex flex-col items-center text-center">
        
        {/* Badge Icon */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md border border-[#315475] bg-[#071a2f] text-2xl text-[#51a9ff]">
          <HiOutlineKey className="-rotate-45" />
        </div>

        {/* Title */}
        <h1 className="auth-title">
          Set new password
        </h1>

        {/* Subtitle */}
        <p className="auth-copy mt-2 mb-8 max-w-[340px]">
          Please choose a strong password with at least 6 characters.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
          <div>
            <label className="field-label">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          <div>
            <label className="field-label">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="field-input pr-11"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-button mt-2 w-full"
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
              'Update Password'
            )}
          </button>
        </form>

        <p className="mt-7 text-center text-xs text-[#aebed4]">
          Remember your password?{' '}
          <Link to="/login" className="text-link">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;