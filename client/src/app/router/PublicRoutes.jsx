import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { PublicCompanyPage } from '../../pages/public/PublicCompanyPage';
import { PublicProfilePage } from '../../pages/public/PublicProfilePage';
import { NotFoundPage } from '../../pages/public/NotFoundPage';

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="company" element={<PublicCompanyPage />} />
      <Route path=":slug" element={<PublicProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
