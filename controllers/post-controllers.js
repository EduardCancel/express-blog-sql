const post = require("../data/post-1"); // Assicurati che sia un array

// Index - Restituisce tutti i post
function index(req, res) {
  const tag = req.query.tags;
  const filteredPost = post.filter(
    (thisPost) => thisPost.tags && thisPost.tags.includes(tag)
  );
  if (tag) {
    return res.json(filteredPost);
  } else {
    res.json(post);
  }
}

// Show - Restituisce un post specifico in base allo slug
function show(req, res) {
  const postSlug = req.params.slug;
  console.log("Slug ricevuto:", postSlug);

  const postFound = post.find((p) => p.slug === postSlug);

  if (!postFound) {
    return res.status(404).json({ error: "Post non trovato" });
  }

  res.json(postFound);
}

// Store - Crea un nuovo post
function store(req, res) {
  if (!req.body.title || !req.body.content) {
    return res
      .status(400)
      .json({ error: "Titolo e contenuto sono obbligatori" });
  }

  const newSlug = req.body.title.toLowerCase().split(" ").join("-");

  const newPost = {
    title: req.body.title,
    slug: newSlug,
    content: req.body.content,
    image: req.body.image || "",
    tags: req.body.tags || [],
  };

  post.push(newPost);

  console.log("Post aggiunto:", newPost);
  res.status(201).json(newPost);
}

// Update - Aggiorna un post esistente
function update(req, res) {
  const postSlug = req.params.slug;
  const postFound = post.find((p) => p.slug === postSlug);

  if (!postFound) {
    return res.status(404).json({ error: "Post non trovato" });
  }

  postFound.title = req.body.title || postFound.title;
  postFound.slug = req.body.title
    ? req.body.title.split(" ").join("-").toLowerCase()
    : postFound.slug;
  postFound.content = req.body.content || postFound.content;
  postFound.image = req.body.image || postFound.image;
  postFound.tags = req.body.tags || postFound.tags;

  console.log("Post aggiornato:", postFound);
  res.status(200).json(postFound);
}

// Destroy - Elimina un post
function destroy(req, res) {
  const postSlug = req.params.slug;
  const index = post.findIndex((p) => p.slug === postSlug);

  if (index === -1) {
    return res.status(404).json({ error: "Post non trovato" });
  }

  post.splice(index, 1);
  console.log("Post eliminato:", postSlug);
  res.sendStatus(204);
}

module.exports = { index, show, store, update, destroy };
