// routes/meet.js
import express from "express";
import { google } from "googleapis";
import { pool } from "../db/index.js";

const router = express.Router();

router.post("/create-meeting/:google_id", async (req, res) => {
  const { google_id } = req.params;

  try {
    const userResult = await pool.query("SELECT access_token FROM users WHERE google_id = $1", [google_id]);
    if (userResult.rows.length === 0) return res.status(404).json({ message: "Usuário não encontrado" });

    const accessToken = userResult.rows[0].access_token;

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: "Reunião com Meet",
        description: "Reunião criada via MeetLinks",
        start: { dateTime: new Date(Date.now() + 60000).toISOString() },
        end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`, // ID único para o link
          },
        },
      },
    });

    const meetLink = response.data.hangoutLink;
    res.json({ meetLink });
  } catch (error) {
    console.error("Erro ao criar reunião:", error);
    res.status(500).json({ message: "Erro ao criar reunião" });
  }
});

export default router;
