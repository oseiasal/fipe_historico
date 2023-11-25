'use client'
import { useEffect, useState } from "react";
import { calcVariation, convertBrandsInReactSelectOptions, convertInReactSelectOptions, orderByMonthReference, searchForLastFipeCode } from "../utils";
import Button from "@/components/Button";

import Select from "react-select";

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

  const [isLoading, setisLoading] = useState(false)

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
   const final_table = searchForLastFipeCode(
     tableList,
     fipeData.AnoModelo
   )?.Codigo;

   const promises = [];

   for (let index = actual_table; index > final_table; index--) {
     promises.push(
       getFipeData(index, brandCode, modelCode, fipeData.AnoModelo)
     );
   }

   try {
     const results = await Promise.all(promises);
     setTable((state) => [...state, ...results]);
     setisLoading(false);
   } catch (error) {
     console.error("Error fetching data:", error);
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
              onChange={(option) => {
                setBrandCode(option.value);
              }}
              options={convertBrandsInReactSelectOptions(brandList)}
              className="m-2 py-2 px-2 text-gray-700"
            />

            <Select
              onChange={(option) => {
                setModelCode(option.value);
              }}
              options={convertInReactSelectOptions(brandCarsList)}
              className="m-2 py-2 px-2 text-gray-700"
            />

            <select
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

        <div className="m-5">
          <h2 className="text-xl font-semibold mt-2 mb-2">Variação:</h2>
          <div className="flex flex-row flex-wrap">
            <div
              className={`${
                calcVariation(table, 2) >= 0 ? "bg-green-500" : "bg-red-500"
              }  h-24 p-5 rounded-sm text-white  text-center mr-1 flex justify-center items-center min-[150px] mt-1`}
            >
              <span className="h-fit">2 meses {calcVariation(table, 2)}% </span>
            </div>
            <div
              className={`${
                calcVariation(table, 6) >= 0
                  ? "bg-green-500"
                  : "bg-red-500 min-[150px]"
              }  h-24 p-5 rounded-sm text-white  text-center mr-1 flex justify-center items-center min-[150px] mt-1`}
            >
              <span>6 meses {calcVariation(table, 6)}%</span>
            </div>
            <div
              className={`${
                calcVariation(table, 12) >= 0 ? "bg-green-500" : "bg-red-500"
              }  h-24 p-5 rounded-sm text-white  text-center mr-1 flex justify-center items-center min-[150px] mt-1`}
            >
              <span>12 meses {calcVariation(table, 12)}%</span>
            </div>
            <div
              className={`${
                calcVariation(table, 120) >= 0 ? "bg-green-500" : "bg-red-500"
              }  h-24 p-5 rounded-sm text-white  text-center mr-1 flex justify-center items-center min-[150px] mt-1`}
            >
              <span> 10 anos {calcVariation(table, 120)}%</span>
            </div>
          </div>
        </div>

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
