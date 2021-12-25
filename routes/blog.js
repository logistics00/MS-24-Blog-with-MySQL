const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/posts');
});

// Add a new post
router.post('/posts', async function (req, res) {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query(
    'INSERT INTO posts (title, summary, body, author_id) VALUES(?)',
    [data]
  );
  res.redirect('/posts');
});

// Display all posts
router.get('/posts', async function (req, res) {
  const query = `
    SELECT posts.*, authors.name AS authors_name FROM posts
    INNER JOIN authors ON posts.author_id = authors.id
  `;
  const [posts] = await db.query(query);
  res.render('posts-list', { posts: posts });
});

// Display post-details
router.get('/posts/:id', async function (req, res) {
  const query = `
    SELECT posts.*, authors.name AS authors_name, authors.email AS author_email FROM posts
    INNER JOIN authors ON posts.author_id = authors.id
    WHERE posts.id = ?
  `;
  const [posts] = await db.query(query, [req.params.id]);
  if (!posts || posts.length === 0) {
    return res.status(404).render('404');
  }

  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanReadableDate: posts[0].date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };

  res.render('post-detail', { post: postData });
});

// Display input-screen for updating an existing post
router.get('/posts/:id/edit', async function (req, res) {
  const query = `
    SELECT * FROM posts WHERE id = ?
  `;
  const [posts] = await db.query(query, [req.params.id]);
  if (!posts || posts.length === 0) {
    return res.status(404).render('404');
  }

  res.render('update-post', { post: posts[0] });
});

// Update an existing post
router.post('/posts/:id/edit', async function (req, res) {
  const data = [req.body.title, req.body.summary, req.body.content];
  const query = `
    UPDATE posts SET title = ?, summary = ?, body = ?
    WHERE id = ?
  `;
  await db.query(query, [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.params.id,
  ]);
  res.redirect('/posts');
});

// Display input-screen for adding a new post
router.get('/new-post', async function (req, res) {
  const [authors] = await db.query('SELECT * FROM authors');
  res.render('create-post', { authors: authors });
});

module.exports = router;
