export function extractSortedYears(array) {
  const years = array.map((item) => parseInt(item.Value.split("-")[0]));
  const sortedYears = years.sort((a, b) => b - a);
  return sortedYears;
}

export function searchForLastFipeCode(fipelist, year) {
  return fipelist
    .filter((table) => table.Mes.replace(/\D/g, "").match(year))
    .at(-1);
}

export const orderByMonthReference = (array) => {
  const ordenacao = (a, b) => {
    const anoA = parseInt(a?.MesReferencia?.split(" de ")[1]);
    const anoB = parseInt(b?.MesReferencia?.split(" de ")[1]);

    if (anoA !== anoB) {
      return anoB - anoA;
    }

    const meses = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];

    const mesA = meses?.indexOf(a?.MesReferencia?.split(" de ")[0]);
    const mesB = meses?.indexOf(b.MesReferencia.split(" de ")[0]);

    return mesB - mesA;
  };

  const arrayOrdenado = [...array].sort(ordenacao);

  return arrayOrdenado;
};

export function calcVariation(array, months) {
    let filteredArray = array?.filter(item => item?.Valor);

    let numericArray = filteredArray?.map(carro => {
        // Cria uma cópia do objeto para evitar modificar o array externo
        const carroCopy = { ...carro };

        // Verifica se a propriedade "Valor" existe e tem um formato válido
        if (carroCopy && carroCopy?.Valor&& typeof carroCopy?.Valor=== 'string') {
            carroCopy['Valor']  = parseFloat(carroCopy?.Valor.replace(/\D/g, '')) / 100;
        } else {
            // Se não for possível converter, atribui 0
            carroCopy['Valor'] = 0;
        }

        return carroCopy;
    });

    let variation = ((numericArray[0]?.Valor- numericArray[months - 1]?.Valor) / numericArray[months - 1]?.Valor) * 100;

    return parseFloat(variation.toFixed(2));
}

export function convertBrandsInReactSelectOptions (cars){
    return cars?.map(car => {
        let vehicle = {...car}
        return {
            value: vehicle?.Value,
            label: vehicle?.Label
        }
    }) || []
}

export function convertInReactSelectOptions (cars){
    return cars?.map(car => {
        let vehicle = {...car}
        return {
            value: vehicle?.Value,
            label: vehicle?.Label
        }
    }) || []
}

export function transformarDadosParaChartJS(dados) {
    // Separar os dados em rótulos e conjuntos de dados
    const rotulos = dados.map(item => item?.MesReferencia)?.filter(item => item != undefined).reverse();
    const valores = dados.map(item => parseFloat(item?.Valor?.replace('R$ ', '')?.replace('', '')))?.filter(item => isNaN(item) == false).map(item => item*1000).reverse();

    // Criar objeto de conjunto de dados no formato do Chart.js
    const dataset = {
        label: 'Valor do veículo ao longo dos meses',
        data: valores,
        backgroundColor: 'lightblue',
        borderColor: 'blue', // Cor da linha do gráfico
        borderWidth: 1 // Largura da linha do gráfico
    };

    // Retornar um objeto no formato esperado pelo Chart.js
    return {
        labels: rotulos,
        datasets: [dataset]
    };
}
