import { searchVehicleData } from "@/services/fipe_api";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { modelCode, brandCode, carYear, fipeTable } = context;

  try {
    const data = await searchVehicleData(
      modelCode,
      brandCode,
      carYear,
      fipeTable,
    );
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível fazer esta solicitação" }, {status: 400});
  }
}
