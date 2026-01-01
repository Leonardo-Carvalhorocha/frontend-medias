import api from "./api";

export let getSelectFiltros = async(formData: FormData): Promise<{filtros: string[]}> => {
    let response = await api.post<{filtros: string[]}>('/select-filtros', formData);
    return response.data;
}

export let calculoMedias = async(formData: FormData): Promise<any> => {
    let response = await api.post<any>('/calculo-medias', formData);
    return response.data;
}

export let downloadXlsx = async () => {
  const response = await api.post('/download', null, {
    responseType: 'blob'
  });

  const blob = new Blob(
    [response.data],
    {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  );

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'resultado-medias.xlsx';
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};
