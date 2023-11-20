import { searchForBrands } from "@/services/fipe_api";

export default async function handler(req, res) {
  const {fipeTable} = req.query;

  try {
    const data = await searchForBrands(fipeTable);
    await res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: err });
  }
}
