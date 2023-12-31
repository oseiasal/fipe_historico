import { NextResponse } from "next/server";
import { searcForCarYears } from "@/services/fipe_api";
import { extractSortedYears } from "@/utils";

export async function GET(req: Request, context: any) {
  const { modelCode, brandCode, fipeTable } = context.params;

  try {
    const cars = await searcForCarYears(modelCode, brandCode, fipeTable);
    const list = await extractSortedYears(cars);
      return NextResponse.json(list, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível fazer esta solicitação" }, {status: 400});
  }
}
