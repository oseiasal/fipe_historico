'use client'
import { useEffect, useState } from "react";
import { calcVariation, convertBrandsInReactSelectOptions, convertInReactSelectOptions, orderByMonthReference, searchForLastFipeCode, trackProgress, transformarDadosParaChartJS } from "../utils";
import Button from "@/components/Button";

import Select from "react-select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const axios = require("axios");



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


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

  const [isLoading, setisLoading] = useState(false)
  const [progress, setProgress] = useState(0);


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

const createHistoricalTable = async (fipeCode) => {
  setisLoading(true);
  let actual_table = fipeCode;
  const final_table = searchForLastFipeCode(tableList, fipeData.AnoModelo)?.Codigo;

  const promises = [];

  for (let index = actual_table; index > final_table; index--) {
    promises.push(getFipeData(index, brandCode, modelCode, fipeData.AnoModelo));
  }

  const totalPromises = promises.length;
  const progressIncrement = 25;
  let completedPromises = 0;
  let currentProgress = 0;

  try {
    const results = await Promise.all(
      promises.map((promise) =>
        promise.then((result) => {
          completedPromises++;
          const newProgress = Math.min(
            Math.ceil((completedPromises / totalPromises) * 100),
            currentProgress + progressIncrement
          );

          if (newProgress > currentProgress) {
            currentProgress = newProgress;
            // Atualize o progresso no console neste exemplo
            setProgress(currentProgress)
          }

          return result;
        })
      )
    );

    // Atualize a tabela com os resultados
    setTable((state) => [...state, ...results]);
    // Indique que o carregamento foi concluído
    setisLoading(false);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Indique que o carregamento foi concluído mesmo em caso de erro
    setisLoading(false);
  }
};



  return (
    <>
      <div className="container mx-auto p-5">
        <div className="flex flex-wrap w-auto justify-between">
          <div className="flex flex-col  m-6 w-2/4 max-md:w-full">
            <h1 className="text-2xl mb-2 font-semibold">
              Histórico de usados FIPE
            </h1>
            <p>Em desenvolvimento</p>
          </div>
          <div className="flex flex-col m-6 w-1/3 max-md:w-full">
            <Select
              placeholder="Pesquisar Marca"
              onChange={(option) => {
                setBrandCode(option.value);
              }}
              options={convertBrandsInReactSelectOptions(brandList)}
              className="m-2 py-2 px-2 text-gray-700"
            />

            <Select
              placeholder="Pesquisar Modelo"
              onChange={(option) => {
                setModelCode(option.value);
              }}
              options={convertInReactSelectOptions(brandCarsList)}
              className="m-2 py-2 px-2 text-gray-700"
            />

            <select
              placeholder="Ano"
              className="m-4  border-solid border-blue-600 border rounded-md py-2 px-1 text-gray-700"
              onChange={(evt) => setYear(evt.target.value)}
            >
              <option selected>-- Ano -- </option>
              {yearsList?.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="m-4">
              <progress id="file" value={progress} max="100"></progress>
            </div>
            <Button
              isLoading={isLoading}
              className="m-2 w-max self-end py-2 px-3 bg-indigo-500 text-white text-sm font-semibold rounded-md shadow focus:outline-none hover:bg-indigo-400"
              onClick={() => {
                setTable([]);
                createHistoricalTable(fipeCode);
              }}
            ></Button>
          </div>
        </div>

        {table.length > 0 && (
          <div className="m-5">
            <h2 className="text-xl font-semibold mt-2 mb-2">Variação:</h2>
            <div className="flex flex-row flex-wrap">
              <div
                className={`${
                  isNaN(calcVariation(table, 2))
                    ? "hidden"
                    : calcVariation(table, 2) >= 0
                    ? "bg-green-500"
                    : "bg-red-500"
                }  h-24 p-5 rounded-sm text-white  text-center mr-1 flex justify-center items-center min-[160px] mt-1 flex-col`}
              >
                <span className="h-fit text-3xl">
                  {calcVariation(table, 2)}%{" "}
                </span>
                <span> 2 meses </span>
              </div>
              <div
                className={`${
                  isNaN(calcVariation(table, 6))
                    ? "hidden"
                    : calcVariation(table, 6) >= 0
                    ? "bg-green-500"
                    : "bg-red-500 min-[150px]"
                }  h-24 p-5 rounded-sm text-white  text-center mr-1 flex justify-center items-center min-[160px] mt-1 flex-col`}
              >
                <span className="h-fit text-3xl">
                  {calcVariation(table, 6)}%
                </span>
                <span>6 meses </span>
              </div>
              <div
                className={`${
                  isNaN(calcVariation(table, 12))
                    ? "hidden"
                    : calcVariation(table, 12) >= 0
                    ? "bg-green-500"
                    : "bg-red-500 min-[150px]"
                }  h-24 p-5 rounded-sm text-white  text-center mr-1 flex justify-center items-center min-[160px] mt-1 flex-col`}
              >
                <span className="h-fit text-3xl">
                  {calcVariation(table, 12)}%
                </span>
                <span>12 meses </span>
              </div>

              <div
                className={`${
                  isNaN(calcVariation(table, 120))
                    ? "hidden"
                    : calcVariation(table, 120) >= 0
                    ? "bg-green-500"
                    : "bg-red-500"
                }  h-24 p-5 rounded-sm text-white  text-center mr-1 flex justify-center items-center min-[160px] mt-1 flex-col`}
              >
                <span className="h-fit text-3xl">
                  {calcVariation(table, 120)}%
                </span>
                <span>10 anos </span>
              </div>
            </div>
          </div>
        )}

        {table.length > 0 && (
          <div className="p-5 h-[300px] w-full ">
            <Line
              data={transformarDadosParaChartJS(table) || { datasets: [] }}
              width={1024}
              options={{
                layout: {
                  padding: 10,
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        )}

        <div className="mx-4">
          <table className="border-collapse table w-full text-left">
            <thead className="border bg-slate-500 text-white ">
              <tr>
                <th className="p-2">Valor</th>
                {/* <th>Marca</th> */}
                {/* <th>Ano Modelo</th> */}
                {/* <th>Combustível</th> */}
                <th className="p-2">Mês Referência</th>
                <th className="p-2 w-max">Código Fipe</th>
                <th>Modelo</th>
              </tr>
            </thead>

            <tbody>
              {orderByMonthReference(table)?.map((veiculo, index) => {
                if (veiculo?.Valor == undefined) return;

                return (
                  <tr key={index} className="border">
                    <td className="text-sm">{veiculo?.Valor}</td>
                    {/* <td>{veiculo.Marca}</td> */}
                    {/* <td>{veiculo.AnoModelo}</td> */}
                    {/* <td>{veiculo.Combustivel}</td> */}
                    <td className="text-sm w-max">{veiculo.MesReferencia}</td>
                    <td className="text-sm">{veiculo.CodigoFipe}</td>
                    <td>{veiculo.Modelo}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
