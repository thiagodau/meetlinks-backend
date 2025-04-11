import express from "express";
import { pool } from "../db/index.js";

const router = express.Router();

router.get("/u/:google_id", async (req, res) => {
  const { google_id } = req.params;

  try {
    const result = await pool.query("SELECT name, email FROM users WHERE google_id = $1", [google_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const { name, email } = result.rows[0];

    res.json({
      name,
      email,
      links: [] // você pode substituir por dados reais depois
    });
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).json({ message: "Erro ao buscar usuário." });
  }
});


export default router;
