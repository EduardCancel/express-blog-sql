const connection = require("../data/dataBase");

const post = require("../data/post-1");

// Index - Restituisce tutti i post
function index(req, res) {
  const sql = "SELECT * FROM posts";
  connection.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
}

// Show - Restituisce un post specifico in base all'id
function show(req, res) {
  const postId = Number(req.params.id);
  const sql = "SELECT * FROM posts WHERE id = ?";

  const sqlJoin = `
    SELECT tags.label
    FROM post_tag
    JOIN tags ON post_tag.tag_id = tags.id
    WHERE post_tag.post_id = ?
  `;

  connection.query(sql, [postId], (err, postResults) => {
    if (err) {
      console.error("Error executing main query:", err);
      return res.status(500).json({ message: "Query failed" });
    }
    if (postResults.length === 0)
      return res.status(404).json({ message: "Post not found" });

    const post = postResults[0];

    connection.query(sqlJoin, [postId], (err, tagResults) => {
      if (err) {
        console.error("Error executing tag query:", err);
        return res.status(500).json({ message: "Query failed" });
      }
      console.log(tagResults);
      post.tags = tagResults;

      res.json(post);
    });
  });
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
  const id = req.params.id;

  const sql = "DELETE FROM posts WHERE id = ?";

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Query Failed" });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "There is nothing to delete" });

    res.sendStatus(204);
  });
}

module.exports = { index, show, store, update, destroy };
