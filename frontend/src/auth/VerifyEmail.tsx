import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { BsCheck2 } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { Oval } from 'react-loader-spinner';
import { API_BASE } from '../config';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const registeredEmail =
    (location.state as { email?: string } | null)?.email?.trim().toLowerCase() ||
    searchParams.get('email')?.trim().toLowerCase() ||
    '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(() =>
    token ? 'loading' : 'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const verificationRequest = useRef<{ token: string; promise: Promise<void> } | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    let request = verificationRequest.current;
    if (!request || request.token !== token) {
      const promise = fetch(`${API_BASE}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Verification failed');
      });
      request = { token, promise };
      verificationRequest.current = request;
    }

    request.promise
      .then(() => {
        if (isMounted) {
          setStatus('success');
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResendEmail = async () => {
    if (!registeredEmail) {
      setErrorMessage('Register again or use the email from your sign-up to resend verification.');
      return;
    }

    setResending(true);
    setErrorMessage('');
    setResent(false);

    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend email');
      setResent(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="auth-page">
        <div className="auth-panel flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-2xl mb-6">
            <BsCheck2 className="stroke-1" />
          </div>
          <h1 className="auth-title mb-2">
            Email verified!
          </h1>
          <p className="auth-copy mb-8">
            Your email is confirmed. You are ready to start collaborating on live whiteboards.
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

  if (status === 'error') {
    return (
      <div className="auth-page">
        <div className="auth-panel flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/80 flex items-center justify-center text-red-400 text-2xl mb-6">
            ✕
          </div>
          <h1 className="auth-title mb-2">
            Verification Failed
          </h1>
          <p className="auth-copy mb-4">
            {errorMessage || 'This verification link is invalid or has expired.'}
          </p>
          {registeredEmail && (
            <button
              type="button"
              onClick={() => void handleResendEmail()}
              disabled={resending}
              className="secondary-button mb-3 w-full"
            >
              {resending ? 'Sending...' : 'Resend verification email'}
            </button>
          )}
          <Link
            to="/login"
            className="primary-button w-full"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-panel flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-2xl mb-6">
          {status === 'loading' ? (
            <Oval
              visible={true}
              height="28"
              width="28"
              color="#10b981"
              secondaryColor="#064e3b"
              strokeWidth={4}
              strokeWidthSecondary={4}
              ariaLabel="oval-loading"
            />
          ) : (
            <HiOutlineMail />
          )}
        </div>

        <h1 className="auth-title">
          Verify your email
        </h1>

        <p className="auth-copy mt-2 mb-7">
          {registeredEmail ? (
            <>
              We sent a secure validation link to{' '}
              <span className="font-semibold text-white">{registeredEmail}</span>
            </>
          ) : (
            'Check your inbox for the verification link we sent after sign-up.'
          )}
        </p>

        <div className="mb-6 flex w-full flex-col items-center rounded-md border border-[#315475] bg-[#071a2f] p-6 text-center">
          <HiOutlineMail className="mb-3 text-3xl text-[#51a9ff]" />
          <p className="auth-copy max-w-[320px]">
            Click the activation link inside the validation email to finalize registration and start drawing.
          </p>
        </div>

        {errorMessage && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        {resent && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl">
            Verification email sent. Check your inbox and spam folder.
          </div>
        )}

        <button
          type="button"
          onClick={() => void handleResendEmail()}
          disabled={resending || !registeredEmail}
          className="primary-button mb-4 w-full"
        >
          {resending ? (
            <Oval
              visible={true}
              height="18"
              width="18"
              color="#ffffff"
              secondaryColor="#79a7ff"
              strokeWidth={4}
              strokeWidthSecondary={4}
              ariaLabel="oval-resend-loading"
            />
          ) : (
            'Resend Email'
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-link text-xs transition"
        >
          Change Email Address
        </button>

        <Link
          to="/login"
          className="mt-6 text-xs font-semibold text-[#aebed4] transition hover:text-white"
        >
          Already verified? Sign in
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
