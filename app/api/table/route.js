import { NextResponse } from 'next/server'
import { searchForTable } from "@/services/fipe_api";
export async function GET(req, res) {

  try {
    const data = await searchForTable();
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível fazer esta solicitação" }, {status: 400});
  }
}
