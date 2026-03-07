import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { BsCheckLg } from 'react-icons/bs';
import { FiRefreshCw } from 'react-icons/fi';
import { randomAvataaarsGrid } from '../lib/avataaars';
import { UserAvatar } from '../components/UserAvatar';
import { BrandMark } from '../components/BrandMark';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'avatar'>('form');
  const [setupToken, setSetupToken] = useState('');
  const [avatarChoices, setAvatarChoices] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  const shuffleAvatars = () => {
    const next = randomAvataaarsGrid(8);
    setAvatarChoices(next);
    setSelectedAvatar(next[0] || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError('');
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: normalizedEmail, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');

      setSetupToken(typeof data.setupToken === 'string' ? data.setupToken : '');
      setEmail(normalizedEmail);
      shuffleAvatars();
      setStep('avatar');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) {
      setError('Pick an avatar to continue');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (setupToken) {
        const res = await fetch(`${API_BASE}/api/auth/setup-avatar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: setupToken, avatarUrl: selectedAvatar }),
        });
        const data = await res.json();
        if (!res.ok) {
          const expired =
            typeof data.error === 'string' && data.error.toLowerCase().includes('expired');
          if (!expired) throw new Error(data.error || 'Failed to save avatar');
        }
      }
      navigate('/verify-email', { state: { email }, replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'avatar') {
    return (
      <div className="auth-page">
        <div className="auth-panel text-center">
          <h2 className="auth-title mb-2">Choose your avatar</h2>
          <p className="auth-copy mb-6">
            Pick a random Avataaars face. You can change this later in Settings.
          </p>

          {error && (
            <div className="mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-5 sm:grid-cols-4">
            {avatarChoices.map((url, index) => {
              const isSelected = url === selectedAvatar;
              return (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`rounded-full p-0.5 transition ${
                    isSelected
                      ? 'ring-2 ring-[#ffdc45] ring-offset-2 ring-offset-[#0b2540]'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <UserAvatar name={name} avatarUrl={url} size={64} />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={shuffleAvatars}
            className="secondary-button mb-6 inline-flex min-h-9 text-xs"
          >
            <FiRefreshCw className="text-xs" />
            Shuffle random avatars
          </button>

          <button
            type="button"
            onClick={() => void handleSaveAvatar()}
            disabled={loading || !selectedAvatar}
            className="primary-button w-full"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-panel flex flex-col items-center">
        
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-2.5 mb-6 hover:opacity-90 transition">
          <BrandMark inverse />
        </Link>

        {/* Title & Subtitle */}
        <h1 className="auth-title text-center">
          Create your account
        </h1>
        <p className="auth-copy mt-1 mb-7 text-center">
          Start collaborating in real-time today
        </p>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="field-label">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="field-input"
            />
          </div>

          <div>
            <label className="field-label">
              Email Address
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

          <div>
            <label className="field-label">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
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

          {/* Terms & Conditions Checkbox */}
          <label className="flex items-center gap-2.5 mt-1 cursor-pointer select-none">
            <div
              onClick={() => setAgreeToTerms(!agreeToTerms)}
              className={`w-4 h-4 rounded flex items-center justify-center transition border ${
                agreeToTerms
                  ? 'bg-[#ffdc45] border-[#ffdc45] text-[#102039]'
                  : 'bg-[#071a2f] border-[#42627f]'
              }`}
            >
              {agreeToTerms && <BsCheckLg className="text-[10px]" />}
            </div>
            <span className="text-[11px] text-[#aebed4]">
              I agree to the{' '}
              <a href="#terms" className="text-link">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-link">
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="primary-button mt-2 w-full"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-7 text-center text-xs text-[#aebed4]">
          Already have an account?{' '}
          <Link to="/login" className="text-link">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;