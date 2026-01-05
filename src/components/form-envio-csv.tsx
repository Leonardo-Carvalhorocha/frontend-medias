import { useState, useRef, type ChangeEvent } from "react";
import {
  calculoMedias,
  getSelectFiltros,
  pageCalculoMedias,
} from "../services/api-csv.service";
import TablesValorForm from "./tables-valor-form";
import Header from "./header";

type FiltroForm = {
  colunaCsv_01: string;
  valorFiltro_01: string;
  colunaCsv_02: string;
  valorFiltro_02: string;
  periodoInicio: string;
  periodoFim: string;
  aberto: boolean;
  mes: number;
};

function FormEnvioCsv() {
  let [filtrosCsv, setFiltrosCsv] = useState<string[]>([]);
  let [file, setFile] = useState<File | null>(null);
  let [dado, setdado] = useState<any>();
  let [loading, setLoading] = useState(false);
  let [filtrosAbertos, setFiltrosAbertos] = useState(true);
  let fileInputRef = useRef<HTMLInputElement | null>(null);
  const [page, setPage] = useState(1);

  let [filtros, setFiltros] = useState<FiltroForm[]>([
    {
      colunaCsv_01: "",
      valorFiltro_01: "",
      colunaCsv_02: "",
      valorFiltro_02: "",
      periodoInicio: "",
      periodoFim: "",
      aberto: true,
      mes: 12,
    },
  ]);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

    carregarFiltro(formData);
  }

  let carregarFiltro = async (form: FormData) => {
    let data = await getSelectFiltros(form);
    setFiltrosCsv(data.filtros);
  };

  let alterarPagina = async (novaPagina: number) => {
    setPage(novaPagina);
    const data = await pageCalculoMedias(novaPagina);
    setdado(data);
  };

  function adicionarFiltro() {
    setFiltros((prev) => [
      ...prev,
      {
        colunaCsv_01: "",
        valorFiltro_01: "",
        colunaCsv_02: "",
        valorFiltro_02: "",
        periodoInicio: "",
        periodoFim: "",
        aberto: true,
        mes: 12,
      },
    ]);
  }

  function removerFiltro(index: number) {
    if (filtros.length === 1) return;
    setFiltros((prev) => prev.filter((_, i) => i !== index));
  }

  function atualizarFiltro(
    index: number,
    campo: keyof FiltroForm,
    valor: string | boolean,
    mes?: number
  ) {
    let copia = [...filtros];

    copia[index] = {
      ...copia[index],
      [campo]: valor,
      ...(mes !== undefined && { mes }),
    };

    setFiltros(copia);
  }

  let handleSubmit = async () => {
    if (!file) return;

    const filtrosValidos = filtros.filter((f) => {
      if (!f.colunaCsv_01) return false;

      if (f.colunaCsv_01 === "Período Aquisitivo") {
        return !!f.periodoInicio && !!f.periodoFim;
      }

      return !!f.valorFiltro_01;
    });

    if (filtrosValidos.length === 0) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filtros", JSON.stringify(filtrosValidos));

    try {
      setLoading(true);
      let data = await calculoMedias(formData, page);
      setdado(data);
      setFiltrosAbertos(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Header />

      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow overflow-hidden">
        <button
          type="button"
          onClick={() => setFiltrosAbertos((prev) => !prev)}
          className="w-full flex justify-between items-center px-6 py-4 bg-gray-100 font-semibold text-gray-700"
        >
          Filtros CSV
          <span className="text-xl">{filtrosAbertos ? "−" : "+"}</span>
        </button>

        {filtrosAbertos && (
          <form className="space-y-4 p-6" onSubmit={(e) => e.preventDefault()}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleChange}
              className="w-full text-sm text-gray-600"
            />

            {file && (
              <p className="text-sm text-gray-500">
                Arquivo selecionado: <strong>{file.name}</strong>
              </p>
            )}

            {filtros.map((filtro, index) => (
              <div key={index} className="border rounded-lg">
                <div>
                  <div className="flex justify-between items-center p-3 bg-gray-100">
                    <button
                      type="button"
                      onClick={() =>
                        atualizarFiltro(index, "aberto", !filtro.aberto)
                      }
                      className="flex items-center gap-2 font-medium"
                    >
                      Filtro #{index + 1}
                      <span className="text-xl">
                        {filtro.aberto ? "−" : "+"}
                      </span>
                    </button>

                    <div className="space-x-4">
                      <label className="text-sm font-medium text-gray-700">
                        Dividir médias por:
                      </label>

                      <select
                        value={filtro.mes ?? 12}
                        onChange={(e) =>
                          atualizarFiltro(
                            index,
                            "mes",
                            e.target.value,
                            Number(e.target.value)
                          )
                        }
                        className="border rounded-lg px-3 py-2 text-sm"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} meses
                          </option>
                        ))}
                      </select>
                    </div>

                    {filtros.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerFiltro(index)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>

                {filtro.aberto && (
                  <div className="p-4 space-y-3">
                    <select
                      value={filtro.colunaCsv_01}
                      onChange={(e) => {
                        setFiltros((prev) => {
                          const copia = [...prev];
                          copia[index] = {
                            ...copia[index],
                            colunaCsv_01: e.target.value,
                            valorFiltro_01: "",
                            periodoInicio: "",
                            periodoFim: "",
                          };
                          return copia;
                        });
                      }}
                      className="w-full rounded-lg border p-2"
                    >
                      <option value="">Campo filtro 01</option>
                      {filtrosCsv.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>

                    {filtro.colunaCsv_01 === "Período Aquisitivo" ? (
                      <div className="flex gap-2">
                        <input
                          type="month"
                          value={filtro.periodoInicio}
                          onChange={(e) =>
                            atualizarFiltro(
                              index,
                              "periodoInicio",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg p-2"
                        />

                        <input
                          type="month"
                          value={filtro.periodoFim}
                          onChange={(e) =>
                            atualizarFiltro(index, "periodoFim", e.target.value)
                          }
                          className="w-full border rounded-lg p-2"
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={filtro.valorFiltro_01}
                        onChange={(e) =>
                          atualizarFiltro(
                            index,
                            "valorFiltro_01",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border p-2"
                        placeholder="Valor filtro 01"
                      />
                    )}

                    {filtro.colunaCsv_01 !== "Período Aquisitivo" && (
                      <>
                        <select
                          value={filtro.colunaCsv_02}
                          onChange={(e) => {
                            setFiltros((prev) => {
                              const copia = [...prev];
                              copia[index] = {
                                ...copia[index],
                                colunaCsv_02: e.target.value,
                                valorFiltro_02: "",
                                periodoInicio: "",
                                periodoFim: "",
                              };
                              return copia;
                            });
                          }}
                          className="w-full rounded-lg border p-2"
                        >
                          <option value="">Campo filtro 02 (opcional)</option>
                          {filtrosCsv.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>

                        {filtro.colunaCsv_02 === "Período Aquisitivo" ? (
                          <div className="flex gap-2">
                            <input
                              type="month"
                              value={filtro.periodoInicio}
                              onChange={(e) =>
                                atualizarFiltro(
                                  index,
                                  "periodoInicio",
                                  e.target.value
                                )
                              }
                              className="w-full border rounded-lg p-2"
                            />

                            <input
                              type="month"
                              value={filtro.periodoFim}
                              onChange={(e) =>
                                atualizarFiltro(
                                  index,
                                  "periodoFim",
                                  e.target.value
                                )
                              }
                              className="w-full border rounded-lg p-2"
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={filtro.valorFiltro_02}
                            onChange={(e) =>
                              atualizarFiltro(
                                index,
                                "valorFiltro_02",
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border p-2"
                            placeholder="Valor filtro 02"
                          />
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={adicionarFiltro}
              className="w-full border border-dashed border-blue-500 text-blue-600 py-2 rounded-lg"
            >
              + Adicionar filtro
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white transition
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {loading ? "Processando..." : "Filtrar"}
            </button>
          </form>
        )}
      </div>

      {dado && dado.resultados && <TablesValorForm dados={dado.resultados} />}

      {dado && dado.resultados && (
        <>
          <TablesValorForm dados={dado.resultados} />

          {dado.totalPages > 1 && (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
              <div className="flex justify-center items-center gap-4 py-3">
                <button
                  onClick={() => alterarPagina(Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Anterior
                </button>

                <span className="text-sm text-gray-700 font-medium">
                  Página {page} de {dado.totalPages}
                </span>

                <button
                  onClick={() =>
                    alterarPagina(Math.min(page + 1, dado.totalPages))
                  }
                  disabled={page === dado.totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FormEnvioCsv;
