import { searchVehicleData } from "@/services/fipe_api";

export default async function handler(req, res) {
  const { modelCode, brandCode, carYear, fipeTable } = req.query;

  try {
    const data = await searchVehicleData(
      modelCode,
      brandCode,
      carYear,
      fipeTable,
    );
    res.status(200).json(data);
  } catch (error) {}
}
