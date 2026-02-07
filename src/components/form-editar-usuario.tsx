import { useState, useEffect, type FormEvent } from "react";
import { getUsuario, atualizarUsuario, setUsuarioLocalStorage, type AtualizarUsuarioDTO } from "../services/api.auth.service";
import Header from "./header";
import type { Usuario } from "../models/usuario";

function FormEditarUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const [mostrarModalSenha, setMostrarModalSenha] = useState(false);
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");

  useEffect(() => {
    const usuario = getUsuario();
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
    }
  }, []);

  function handlePreSubmit(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);
    setMostrarModalSenha(true);
  }

  async function handleConfirmarAlteracao() {
    if (!senhaConfirmacao) {
      alert("Por favor, digite sua senha atual.");
      return;
    }

    setLoading(true);
    setMostrarModalSenha(false);

    const dados: AtualizarUsuarioDTO = {
      nome,
      email,
      senhaAtual: senhaConfirmacao,
      novaSenha: novaSenha || undefined,
    };

    try {
      const usuarioAtualizado: { usuario: Usuario } = await atualizarUsuario(dados);
      setUsuarioLocalStorage(usuarioAtualizado.usuario);
      setMensagem({ tipo: "sucesso", texto: "Usuário atualizado com sucesso!" });
      setNovaSenha("");
      setSenhaConfirmacao("");
    } catch (error: any) {
      const erroMsg = error?.response?.data?.erro || "Erro ao atualizar usuário.";
      setMensagem({ tipo: "erro", texto: erroMsg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <Header />
      
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Editar Usuário</h2>

        {mensagem && (
          <div className={`p-4 mb-4 rounded-md text-sm ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handlePreSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha (opcional)</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Deixe em branco para manter a atual"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>

      {mostrarModalSenha && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirmar Alteração</h3>
            <p className="text-sm text-gray-600 mb-4">
              Para sua segurança, digite sua senha atual para confirmar as alterações.
            </p>
            
            <input
              type="password"
              value={senhaConfirmacao}
              onChange={(e) => setSenhaConfirmacao(e.target.value)}
              placeholder="Senha atual"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setMostrarModalSenha(false);
                  setSenhaConfirmacao("");
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarAlteracao}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormEditarUsuario;