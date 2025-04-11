import express from "express";
import passport from "passport";
import session from "express-session";
import cors from 'cors';

import dotenv from "dotenv";

import "./auth/google.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import meetRoutes from "./routes/meet.js";
import roomsRoutes from "./routes/rooms.js";


dotenv.config();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
/*
app.use((req, res, next) => {
  console.log("Sessão atual:", req.session);
  console.log("Usuário atual:", req.user);
  next();
  });*/

app.use(cors());  // Permite de qualquer origem

app.use("/", userRoutes);
app.use("/auth", authRoutes);
app.use("/meet", meetRoutes);
app.use('/api/rooms', roomsRoutes);

app.get("/", (req, res) => {
  res.status(201).json({ message: "MeetLinks API rodando! 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
