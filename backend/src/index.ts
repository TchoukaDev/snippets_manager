// On importe le module Express, qui permet de créer un serveur HTTP facilement
import express from "express";

// On importe CORS, un middleware qui permet de gérer les requêtes entre différents domaines
import cors from "cors";

// On importe dotenv, qui permet de charger les variables d'environnement depuis un fichier .env
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import { categoryRoutes, snippetRoutes, tagsRoutes } from "./routes";

// On exécute dotenv pour que les variables du fichier .env soient disponibles dans process.env
dotenv.config();

// Création de l'application Express
const app = express();

// Définition du port sur lequel le serveur va écouter
// Si une variable d'environnement PORT existe, on l'utilise, sinon par défaut 3001
const PORT = process.env.PORT || 3001;

// Middleware pour autoriser les requêtes provenant d'autres domaines (cross-origin)
// Utile pour que ton front React (localhost:3000) puisse parler à ton back (localhost:3001)
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
// Cela permet de lire req.body pour POST/PUT requests
app.use(express.json());


app.use("/snippets", snippetRoutes)
app.use("/tags", tagsRoutes)
app.use("/categories", categoryRoutes)

app.use(errorHandler)


// On démarre le serveur et on écoute sur le port défini
// Une fois lancé, on affiche un message dans la console pour savoir que le serveur tourne
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
