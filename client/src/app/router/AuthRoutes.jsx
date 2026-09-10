import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { LoginPage } from '../../pages/auth/LoginPage';
import { RegisterPage } from '../../pages/auth/RegisterPage';
import { VerifyOTPPage } from '../../pages/auth/VerifyOTPPage';
import { ForgotPasswordPage } from '../../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../../pages/auth/ResetPasswordPage';
import { AcceptInvitationPage } from '../../pages/auth/AcceptInvitationPage';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="verify-otp" element={<VerifyOTPPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="accept-invitation" element={<AcceptInvitationPage />} />
      <Route path="invite/accept" element={<AcceptInvitationPage />} />
      <Route path="invitations/accept" element={<AcceptInvitationPage />} />
      <Route path="invite" element={<AcceptInvitationPage />} />
    </Routes>
  );
};
