import { searchForTable } from "../../../services/fipe_api";

export default async function handler(req, res) {
  try {
    const data = await searchForTable();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: "Não foi possível fazer esta solicitação" });
  }
}
