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
