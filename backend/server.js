// backend/server.js
import express from "express";
import dotenv from "dotenv";
import pg from "pg";
const { Pool } = pg;

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connexion PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test de connexion à la BDD
pool.connect()
  .then(() => console.log("✅ Connecté à PostgreSQL"))
  .catch((err) => console.error("❌ Erreur connexion PostgreSQL :", err));

// Route test
app.get("/", (req, res) => {
  res.send("🚀 Backend en ligne !");
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🟢 Serveur backend démarré sur http://localhost:${port}`);
});
