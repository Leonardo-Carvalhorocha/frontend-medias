import type { AdiantamentoDecimoTerceiroDTO } from "../components/form-adiantamentodecimo";
import type { FiltroForm } from "../components/form-envio-csv";
import api from "./api";

export let getSelectFiltros = async (
  formData: FormData
): Promise<{ filtros: string[] }> => {
  let response = await api.post<{ filtros: string[] }>(
    "/medias/select-filtros",
    formData
  );
  return response.data;
};

export let calculoMedias = async (
  formData: FormData,
  page: number
): Promise<any> => {
  let response = await api.post<any>(
    `/medias/calculo-medias?page${page}`,
    formData
  );
  return response.data;
};

export let pageCalculoMedias = async (page: number): Promise<any> => {
  let response = await api.post<any>(`/medias/page-medias?page=${page}`);
  return response.data;
};

export let downloadXlsx = async () => {
  const response = await api.post("/medias/download", null, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "resultado-medias.xlsx";
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};

export let montarFiltros = async (formData: FormData): Promise<FiltroForm[]> => {
  let response = await api.post<FiltroForm[]>(`/medias/build-filtros`, formData);
  return response.data;
};

export let filtroADTO = async (id: number[]): Promise<{total: number,dados: AdiantamentoDecimoTerceiroDTO[]}>  => {
  let response = await api.post<{total: number,dados: AdiantamentoDecimoTerceiroDTO[]}>(`/decimo-terceiro/filtrar`, {filtro: id});
  return response.data;
}

export let adicionarFiltroLocalStorage = (filtroForm: FiltroForm[]) => {
  if(filtroForm && filtroForm.length > 0) {
    localStorage.setItem('filtros', JSON.stringify(filtroForm));
  }
}

export let getFiltrosLocalStorage = (): FiltroForm[] | null => {
  const filtrosLocalStorage = localStorage.getItem('filtros');
  if(filtrosLocalStorage) {
    return JSON.parse(filtrosLocalStorage);
  }
  return null;
}

export let adicionarFileLocalStorage = (file: File) => {
  const reader = new FileReader();

  reader.onload = () => {
    const base64 = reader.result as string;

    localStorage.setItem("file", JSON.stringify({
      name: file.name,
      type: file.type,
      content: base64
    }));
  };

  reader.readAsDataURL(file);
}

export let getFileLocalStorage = (): File | null => {
  const data = localStorage.getItem("file");
  if (!data) return null;

  const { name, type, content } = JSON.parse(data);

  const byteString = atob(content.split(",")[1]);
  const bytes = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }

  return new File([bytes], name, { type });
}
