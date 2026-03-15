import React from 'react';
import { LazyMotion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { VerifyEmail } from './auth/VerifyEmail';
import { ForgotPassword } from './auth/ForgotPassword';
import { Dashboard } from './dashboard/Dashboard';
import ResetPassword from './auth/ResetPassword';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb]">
        <Oval
          visible={true}
          height="36"
          width="36"
          color="#1957d2"
          secondaryColor="#d6dee9"
          strokeWidth={4}
          strokeWidthSecondary={4}
          ariaLabel="loading"
        />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <LazyMotion features={() => import('./motionFeatures').then((module) => module.default)} strict>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LazyMotion>
  );
}
