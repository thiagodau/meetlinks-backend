import express from "express";
import { pool } from "../db/index.js";

const router = express.Router();

router.get("/u/:google_id", async (req, res) => {
  const { google_id } = req.params;
  const { name, email } = req.body; // vindo no corpo da requisição

  try {
    const result = await pool.query(
      "SELECT name, email FROM users WHERE google_id = $1",
      [google_id]
    );

    if (result.rows.length === 0) {
      console.log("Usuário não encontrado. Inserindo novo usuário.");

      await pool.query(
        "INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3)",
        [google_id, name, email]
      );

      return res.status(201).json({ name, email });
    }

    const user = result.rows[0];
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error("Erro ao buscar ou inserir usuário:", err);
    res.status(500).json({ message: "Erro ao buscar ou inserir usuário." });
  }
});

export default router;
