import { NextResponse } from "next/server";
import { searcForCarYears } from "@/services/fipe_api";
import { extractSortedYears } from "@/utils";

export async function GET(req, context) {
  const { modelCode, brandCode, fipeTable } = context;

  try {
    const cars = await searcForCarYears(modelCode, brandCode, fipeTable);
    const list = await extractSortedYears(cars);
      return NextResponse.json(list, { status: 200 })
  } catch (error) {}
}
