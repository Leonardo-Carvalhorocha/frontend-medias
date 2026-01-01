import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '../components/login-form';
import FormEnvioCsv from '../components/form-envio-csv';
import PrivateRoute from './PrivateRoute';
import Footer from '../components/footer';
import { getToken } from '../services/api.auth.service';

function AppRoutes() {
    const token = getToken();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                token
                  ? <Navigate to="/filtros" replace />
                  : <Navigate to="/login" replace />
              }
            />

            <Route path="/login" element={<LoginForm />} />

            <Route element={<PrivateRoute />}>
              <Route path="/filtros" element={<FormEnvioCsv />} />
            </Route>
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default AppRoutes;
