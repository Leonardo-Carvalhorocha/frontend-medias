import { useState, type JSX } from "react";
import Header from "./header";
import { filtroADTO } from "../services/api-csv.service";

export interface AdiantamentoDecimoTerceiroDTO {
  id: number;
  nome: string;
  grupoCalendario: string;
  concepto: string;
  valor: string | number;
}

export default function AdiantamentoDecimoTerceiro(): JSX.Element {
  const [ids, setIds] = useState<string>("");
  const [dados, setDados] = useState<AdiantamentoDecimoTerceiroDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string>("");

  const buscarAdiantamentos = async (): Promise<void> => {
    setErro("");
    setDados([]);

    const idsArray: number[] = ids
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    if (idsArray.length === 0) {
      setErro("Informe pelo menos um ID válido");
      return;
    }

    try {
      setLoading(true);
      const data = await filtroADTO(idsArray);
      setDados(data.dados);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Buscar Adiantamento 13º
        </h2>

        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
            <div className="w-full md:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IDs (separados por vírgula)
              </label>
              <input
                type="text"
                placeholder="Ex: 276257, 276258"
                value={ids}
                onChange={(e) => setIds(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={buscarAdiantamentos}
              disabled={loading}
              className={`px-5 py-2 rounded-lg text-white text-sm font-medium transition
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {erro && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {erro}
            </div>
          )}
        </div>

        {dados.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Grupo</th>
                  <th className="px-4 py-3">Concepto</th>
                  <th className="px-4 py-3">Valor</th>
                </tr>
              </thead>
              <tbody>
                {dados.map((item) => {
                  const naoEncontrado =
                    item.nome.toLowerCase() === "não foi encontrado";

                  return (
                    <tr
                      key={item.id}
                      className={`border-t transition
                        ${
                          naoEncontrado
                            ? "bg-red-50 text-red-700"
                            : "hover:bg-gray-50"
                        }`}
                    >
                      <td className="px-4 py-2 font-medium">
                        {item.id}
                      </td>
                      <td className="px-4 py-2">
                        {naoEncontrado ? (
                          <span className="italic font-semibold">
                            Não encontrado
                          </span>
                        ) : (
                          item.nome
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {item.grupoCalendario || "-"}
                      </td>
                      <td className="px-4 py-2">
                        {item.concepto || "-"}
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {Number(item.valor) === 0 ? "-" : item.valor}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && dados.length === 0 && !erro && (
          <p className="mt-6 text-sm text-gray-500">
            Nenhum registro encontrado.
          </p>
        )}
      </div>
    </>
  );
}
