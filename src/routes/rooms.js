// No seu arquivo de rotas (por exemplo, routes/rooms.js)

import express from 'express';
import { pool } from '../db/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, link, createdDate, finishDate, status, google_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO rooms (name, link, created_date, finish_date, status, google_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
       [name, link, createdDate, finishDate, status, google_id]
      );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao salvar reunião:", err);
    res.status(500).json({ message: "Erro ao salvar reunião no banco." });
  }
});

// GET /api/rooms/:google_id
router.get('/:google_id', async (req, res) => {
  const { google_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM rooms WHERE google_id = $1 ORDER BY created_date DESC',
      [google_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar reuniões:", err);
    res.status(500).json({ message: "Erro ao buscar reuniões do banco." });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
    res.status(200).json({ message: "Reunião excluída com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir reunião:", err);
    res.status(500).json({ message: "Erro ao excluir reunião do banco." });
  }
});

// No arquivo routes/rooms.js
//VISUALIZAÇÕES
router.get('/views/:google_id', async (req, res) => {
  const { google_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM rooms WHERE google_id = $1 ORDER BY created_date DESC',
      [google_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar reuniões:", err);
    res.status(500).json({ message: "Erro ao buscar reuniões do banco." });
  }
});


export default router;
