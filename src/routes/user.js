import express from "express";
import { pool } from "../db/index.js";

const router = express.Router();

router.get("/u/:google_id", async (req, res) => {
  const { google_id } = req.params;
  console.log(google_id)
  try {
    const result = await pool.query("SELECT name, email FROM users WHERE google_id = $1", [google_id]);

    if (result.rows.length === 0) {
      await pool.query(
        "INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3)",
        [google_id, 'Novo User', null]
      );
      
      result = await pool.query("SELECT name, email FROM users WHERE google_id = $1", [google_id]);
    }

    const { name, email } = result.rows[0];

    res.json({
      name,
      email,
    });
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).json({ message: "Erro ao buscar usuário." });
  }
});


export default router;
