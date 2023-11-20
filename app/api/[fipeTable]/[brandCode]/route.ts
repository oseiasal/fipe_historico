import { searchForAllCarsBrand } from "@/services/fipe_api";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  const { brandCode, fipeTable } = context.params;

  try {
    const cars = await searchForAllCarsBrand(brandCode, fipeTable);
      return NextResponse.json(cars, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível fazer esta solicitação" }, {status: 400});
  }
}
