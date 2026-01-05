type Versao = {
  numero: string;
  descricao: string;
};

export const versoes: Versao[] = [
  {
    numero: '0.0.3',
    descricao:
      'Adicionado filtro para permitir ao usuário definir o número utilizado na divisão das médias, no momento pode-se dividir de 1 a 12. Pedido de  - Adeiza Gross (Recursos Humanos)'
  },
  {
    numero: '0.0.4',
    descricao:
      'Adicionado filtro para trazer todos os funcionários da empresa apenas pelo período com uma única busca na base de dados, foi modificado o backend, paginando o filtro para que o payload da requisição fique longo, a páginação conta com 25 elementos cada. Renata Cardoso (Recursos Humanos)'
  }
];
