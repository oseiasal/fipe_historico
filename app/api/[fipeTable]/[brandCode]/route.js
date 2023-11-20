import { searchForAllCarsBrand } from "@/services/fipe_api";

export default async function handler(req, res) {
  const { brandCode, fipeTable } = req.query;

  try {
    const cars = await searchForAllCarsBrand(brandCode, fipeTable);
    await res.status(200).json(cars);
  } catch (error) {}
}
