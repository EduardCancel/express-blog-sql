const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/post-controllers.js");

// Index - Restituisce tutti i post
router.get("/", postControllers.index);

// Show - Restituisce un post specifico in base all'id
router.get("/:id", postControllers.show);

// Store - Crea un nuovo post
router.post("/", postControllers.store);

// Update - Aggiorna un post esistente
router.put("/:slug", postControllers.update);

// Destroy - Elimina un post
router.delete("/:slug", postControllers.destroy);

module.exports = router;
