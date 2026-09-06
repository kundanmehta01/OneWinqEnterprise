import React from 'react';
import { AppProvider } from './app/providers/AppProvider';
import { AppRoutes } from './app/router/AppRoutes';

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
