import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuario } from "../services/api.auth.service";
import { Link } from "react-router-dom";

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

function Header() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioStorage = getUsuario();

    if (usuarioStorage) {
      setUsuario(usuarioStorage);
    }
  }, []);

  function confirmarLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login", { replace: true });
  }

  return (
    <>
      <header className="w-full bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-2 py-2 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">
            <Link to="/filtros">Sistema de Médias</Link>
          </h1>
          {usuario && (
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <span>
                Olá, <strong>{usuario.nome}</strong>
              </span>

              <Link
                to="/implementacoes"
                className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Implementações
              </Link>

              <button
                onClick={() => setMostrarModal(true)}
                className="px-3 py-1 rounded-md border border-red-500 text-red-600 hover:bg-red-50 transition"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MODAL DE CONFIRMAÇÃO */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirmar saída
            </h2>

            <p className="text-sm text-gray-600">
              Tem certeza que deseja sair do sistema?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
