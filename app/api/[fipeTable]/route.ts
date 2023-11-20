import { NextResponse } from "next/server";
import { searchForBrands } from "@/services/fipe_api";

export async function GET(req: Request, context: any) {
  const {fipeTable} = context;
 
  try {
    const data = await searchForBrands(fipeTable);

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Não foi possível fazer esta solicitação" }, {status: 400});
  }
}
