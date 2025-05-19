// src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  children: React.ReactNode;
}

const PrivateRoute = ({ user, children }: PrivateRouteProps) => {
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
