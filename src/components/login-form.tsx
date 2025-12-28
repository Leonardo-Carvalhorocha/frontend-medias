import { useEffect, useState } from 'react';
import { login } from '../services/api-csv.service';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if(localStorage.getItem('token')) {
            window.location.href = '/filtros';
        }
    }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const resposta = await login({ email, senha });

      // salva sessão
      localStorage.setItem('token', resposta.token);
      localStorage.setItem(
        'usuario',
        JSON.stringify(resposta.usuario)
      );

      // redirecionamento simples (ajuste se usar router)
      window.location.href = '/filtros';
    } catch (error: any) {
      setErro(
        error?.response?.data?.message ||
          'Erro ao realizar login'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SENHA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ERRO */}
          {erro && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              {erro}
            </div>
          )}

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium
                       hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
