import { searchForAllCarsBrand } from "@/services/fipe_api";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { brandCode, fipeTable } = context;

  try {
    const cars = await searchForAllCarsBrand(brandCode, fipeTable);
      return NextResponse.json(cars, { status: 200 })
  } catch (error) {}
}
