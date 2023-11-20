import { searcForCarYears } from "@/services/fipe_api";
import { extractSortedYears } from "@/utils";

export default async function handler(req, res) {
  const { modelCode, brandCode, fipeTable } = req.query;

  try {
    const cars = await searcForCarYears(modelCode, brandCode, fipeTable);
    const list = await extractSortedYears(cars);
    await res.status(200).json(list);
  } catch (error) {}
}
