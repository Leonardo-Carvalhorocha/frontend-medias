import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import LoginForm from '../components/login-form';
import FormEnvioCsv from '../components/form-envio-csv';
import PrivateRoute from './PrivateRoute';
import Footer from '../components/footer';
import { ModalLogout } from '../components/modalLogout';
import { removeTokenLocalStorage, removeUsuarioLocalStorage } from '../services/api.auth.service';
import VersaoImplementacoes from '../components/versao-implementacoes';

function AppRoutes() {
  const [openModal, setOpenModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleLogoutModal = () => {
      setOpenModal(true);
    };
    window.addEventListener('logout-modal', handleLogoutModal);
    return () => {
      window.removeEventListener('logout-modal', handleLogoutModal);
    };
  }, []);

  const handleConfirmLogout = () => {
    setOpenModal(false);
    removeTokenLocalStorage();
    removeUsuarioLocalStorage();
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={ token ? <Navigate to="/filtros" replace /> : <Navigate to="/login" replace /> }
            />

            <Route path="/login" element={<LoginForm />} />

            <Route element={<PrivateRoute />}>
              <Route path="/filtros" element={<FormEnvioCsv />} />
              <Route path="/implementacoes" element={<VersaoImplementacoes />} />
            </Route>
          </Routes>
        </div>

        <Footer />

        <ModalLogout
          open={openModal}
          onConfirm={handleConfirmLogout}
        />
      </div>
    </BrowserRouter>
  );
}

export default AppRoutes;
