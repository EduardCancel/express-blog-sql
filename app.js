const express = require("express");
const cors = require("cors");
const path = require("path"); // Importa il modulo path per gestire i percorsi
const postRoutes = require("./routers/post-rename"); // Aggiungi il tuo router

const app = express(); // Crea l'istanza di express

// Abilita CORS su tutte le richieste
app.use(cors());

// Middleware per gestire i body in formato JSON
app.use(express.json());

// Serve le immagini dalla cartella "public/images"
app.use("/images", express.static(path.join(__dirname, "public", "img")));

// Usa il router delle rotte
app.use("/api/v1/post", postRoutes);

// Definisci altre rotte se necessario (es. root route)
app.get("/", (req, res) => {
  res.send("Benvenuto nel server!");
});

// Avvia il server
const port = 3000;
app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
