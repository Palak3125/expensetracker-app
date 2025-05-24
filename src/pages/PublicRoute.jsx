
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const PublicRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  return user ? <Navigate to="/" /> : children;
};

export default PublicRoute;
