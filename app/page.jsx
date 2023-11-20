'use client'
import { useEffect, useState } from "react";
import { orderByMonthReference, searchForLastFipeCode } from "../utils";

const axios = require("axios");
export default function IndexPage() {
  const [tableList, setTableList] = useState([]);
  const [fipeCode, setFipeCode] = useState(0);

  const [brandList, setBrandList] = useState([]);
  const [brandCode, setBrandCode] = useState(0);
  const [brandCarsList, setBrandCarsList] = useState([]);
  const [modelCode, setModelCode] = useState(0);
  const [yearsList, setYearsList] = useState([]);
  const [year, setYear] = useState(0);

  const [fipeData, setFipeData] = useState("");

  const [table, setTable] = useState([]);

  useEffect(() => {
    'use client'
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/api/table/",
    };

    axios
      .request(config)
      .then((response) => {
        setFipeCode(response.data[0]["Codigo"]);
        setTableList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
      'use client'
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/api/303/",
    };

    axios
      .request(config)
      .then((response) => {
        setBrandList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
      'use client'
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/api/303/" + brandCode,
    };

    axios
      .request(config)
      .then((response) => {
        setBrandCarsList(response.data.Modelos);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [brandCode]);

  useEffect(() => {
      'use client'
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/api/303/" + brandCode + "/" + modelCode,
    };

    axios
      .request(config)
      .then((response) => {
        setYearsList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [modelCode]);

  useEffect(() => {
      'use client'
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/api/303/" + brandCode + "/" + modelCode + "/" + year,
    };

    axios
      .request(config)
      .then((response) => {
        setFipeData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [year]);

  const getFipeData = (fipeCode, brandCode, modelCode, year) => {
      'use client'
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/api/" + fipeCode + "/" + brandCode + "/" + modelCode + "/" + year,
    };

    return axios
      .request(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createHistoricalTable = (fipeCode) => {
    let actual_table = fipeCode;
    const final_table = searchForLastFipeCode(
      tableList,
      fipeData.AnoModelo,
    ).Codigo;
    for (let index = actual_table; index > final_table; index--) {
      getFipeData(index, brandCode, modelCode, fipeData.AnoModelo).then((res) =>
        setTable((state) => [...state, res]),
      );
    }
  };

  return (
    <>
      <div>
        <select
          defaultValue=""
          onChange={(evt) => {
            setBrandCode(evt.target.value);
          }}
        >
          <option selected>-- selecione -- </option>
          {brandList.length == 0 && (
            <option disabled value="">
              {" "}
              Pesquisando marcas...
            </option>
          )}
          {brandList.length > 0 &&
            brandList.map((brand, index) => (
              <option key={index} value={brand.Value}>
                {brand.Label}
              </option>
            ))}
        </select>

        <select
          defaultValue=""
          onChange={(evt) => setModelCode(evt.target.value)}
        >
          <option selected>-- selecione -- </option>
          {brandCarsList?.map((carModel, index) => (
            <option key={index} value={carModel?.Value}>
              {carModel?.Label}
            </option>
          ))}
        </select>

        <select onChange={(evt) => setYear(evt.target.value)}>
          <option selected>-- selecione -- </option>
          {yearsList?.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          setTable([]);
          createHistoricalTable(fipeCode);
        }}
      >
        {" "}
        Click
      </button>

      <table>
        <thead>
          <tr>
            <th>Valor</th>
            {/* <th>Marca</th> */}
            {/* <th>Ano Modelo</th> */}
            {/* <th>Combustível</th> */}
            <th>Mês Referência</th>
            <th>Código Fipe</th>
            {/* <th>Tipo Veículo</th> */}
          </tr>
        </thead>
        <tbody>
          {orderByMonthReference(table)?.map((veiculo, index) => {
            if (veiculo.Valor == undefined) return;

            return (
              <tr key={index}>
                <td>{veiculo.Valor}</td>
                {/* <td>{veiculo.Marca}</td> */}
                {/* <td>{veiculo.AnoModelo}</td> */}
                {/* <td>{veiculo.Combustivel}</td> */}
                <td>{veiculo.MesReferencia}</td>
                <td>{veiculo.CodigoFipe}</td>
                {/* <td>{veiculo.TipoVeiculo}</td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
