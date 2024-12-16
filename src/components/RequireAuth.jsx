import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const { accessToken } = useContext(AuthContext);
  const location = useLocation();

  return (
    accessToken
      ? <Outlet />
      : <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
