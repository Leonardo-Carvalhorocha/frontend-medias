import { useMemo, useState } from 'react';
import { downloadXlsx } from '../services/api-csv.service';

const LIMITE_REGISTROS_POR_PAGINA = 100;
const ALTURA_FIXA_TABELA_PX = 480;

function TablesValorForm({ dados }: any) {
  if (!dados || !dados.length) return null;

  console.log("DADOS PASSOU: ", dados);
  function handleDownloadXlsx() {
    downloadXlsx();
  }

  return (
    <div className="mt-10 space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleDownloadXlsx}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 transition" >
          Baixar XLSX
        </button>
      </div>

      <div className="space-y-10">
        {dados.map((grupo: any, indiceGrupo: any) => (
          <TabelaPorFiltro
            key={`${grupo.filtroAplicado}-${indiceGrupo}`}
            grupo={grupo}
          />
        ))}
      </div>
    </div>
  );
}

function TabelaPorFiltro({ grupo }: { grupo: any }) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [aberto, setAberto] = useState(true);

  const headers =
    grupo.filtrados.length > 0
      ? Object.keys(grupo.filtrados[0])
      : [];

  const totalPaginas = Math.ceil(
    grupo.filtrados.length / LIMITE_REGISTROS_POR_PAGINA
  );

  const registrosPaginados = useMemo(() => {
    const indiceInicial =
      (paginaAtual - 1) * LIMITE_REGISTROS_POR_PAGINA;
    const indiceFinal =
      indiceInicial + LIMITE_REGISTROS_POR_PAGINA;

    return grupo.filtrados.slice(indiceInicial, indiceFinal);
  }, [grupo.filtrados, paginaAtual]);

  function irParaPaginaAnterior() {
    setPaginaAtual((pagina) => Math.max(pagina - 1, 1));
  }

  function irParaPaginaSeguinte() {
    setPaginaAtual((pagina) =>
      Math.min(pagina + 1, totalPaginas)
    );
  }

  return (
    <div className="border border-gray-300 rounded-xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        className="w-full px-4 py-3 bg-gray-100 flex justify-between items-center text-left"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Funcionário:{' '}
            {grupo.nomeFuncionario ? grupo.nomeFuncionario
              : 'Não identificado'}
          </h2>

          <p className="text-sm text-gray-600">
            registros encontrados:{' '}
            <span className="font-semibold">
              {grupo.totalFiltrados}
            </span>
          </p>

          <p className="text-sm text-gray-600">
            Filtro aplicado:{' '}
            <span className="font-semibold">
              {grupo.filtroAplicado}
            </span>
          </p>
        </div>

        <span className="text-2xl font-bold text-gray-600">
          {aberto ? '−' : '+'}
        </span>
      </button>

      {aberto && (
        <div className="p-4 space-y-4">
          {grupo.filtrados.length === 0 ? (
            <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800">
              <p className="font-semibold mb-1">
                Nenhum registro encontrado
              </p>
              <p>
                O filtro aplicado{' '}
                <strong>{grupo.filtroAplicado}</strong> não
                retornou resultados para este arquivo CSV.
              </p>
            </div>
          ) : (
            <>
              <div
                className="overflow-y-auto border border-gray-300 rounded-lg"
                style={{ maxHeight: ALTURA_FIXA_TABELA_PX }}
              >
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      {headers.map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b"
                        >
                          {header.replace('﻿', '').trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {registrosPaginados.map((registro: any, index: any) => (
                      <tr
                        key={index}
                        className="even:bg-gray-50 hover:bg-blue-50"
                      >
                        {headers.map((header) => (
                          <td
                            key={header}
                            className="px-4 py-2 text-sm text-gray-700 border-b"
                          >
                            {registro[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-700">
                <span>
                  <strong>Total:</strong>{' '}
                  {grupo.totalFiltrados}
                </span>

                <span>
                  <strong>Média:</strong>{' '}
                  {grupo.totalValorMedias}
                </span>
              </div>

              {totalPaginas > 1 && (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={irParaPaginaAnterior}
                    disabled={paginaAtual === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  <span className="text-sm">
                    Página {paginaAtual} de {totalPaginas}
                  </span>

                  <button
                    onClick={irParaPaginaSeguinte}
                    disabled={paginaAtual === totalPaginas}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TablesValorForm;
