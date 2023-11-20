import axios from "axios";
import { IncomingHttpHeaders } from "http";

const headers: IncomingHttpHeaders = {
  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  "cookie":
    "_gcl_au=1.1.1059254804.1696122357; nav41729=13a32b959dd432ac65668dd1dd10_319; _ga=GA1.1.667433243.1696122357; _ga_WN7SEBCDBR=GS1.1.1700394411.4.1.1700394422.49.0.0; ROUTEID=.13",
};
export function searchForTable() {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://veiculos.fipe.org.br/api/veiculos/ConsultarTabelaDeReferencia",
    headers,
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

export function searchForBrands(fipeTable: number) {
  let data = "codigoTabelaReferencia=" + fipeTable + "&codigoTipoVeiculo=1";

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://veiculos.fipe.org.br/api/veiculos/ConsultarMarcas",
    headers,
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}

export function searchForAllCarsBrand(brandCode: number, fipeTable: number) {
  let data = `codigoTipoVeiculo=1&codigoTabelaReferencia=${fipeTable}&codigoModelo=&codigoMarca=${brandCode}&ano=&codigoTipoCombustivel=&anoModelo=&modeloCodigoExterno=`;

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://veiculos.fipe.org.br/api/veiculos/ConsultarModelos",
    headers,
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}

export function searcForCarYears(modelCode: number, brandCode: number, fipeTable: number) {
  let data = `codigoTipoVeiculo=1&codigoTabelaReferencia=${fipeTable}&codigoModelo=${modelCode}&codigoMarca=${brandCode}&ano=&codigoTipoCombustivel=&anoModelo=&modeloCodigoExterno=`;

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://veiculos.fipe.org.br/api/veiculos/ConsultarAnoModelo",
    headers,
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

export function searchVehicleData(modelCode: number, brandCode: number, year: number, fipeTable: number) {
  let data = `codigoTabelaReferencia=${fipeTable}&codigoMarca=${brandCode}&codigoModelo=${modelCode}&codigoTipoVeiculo=1&anoModelo=${year}&codigoTipoCombustivel=1&tipoVeiculo=carro&modeloCodigoExterno=&tipoConsulta=tradicional`;

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://veiculos.fipe.org.br/api/veiculos/ConsultarValorComTodosParametros",
    headers,
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
