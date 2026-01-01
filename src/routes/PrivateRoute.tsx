import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../services/api.auth.service';

function PrivateRoute() {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
