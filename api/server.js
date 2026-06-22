const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Load books data
const booksData = require('./data/books.json');

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Simulate network latency (500-1000ms for demo visibility)
function randomDelay() {
  return new Promise(resolve => {
    const delay = Math.floor(Math.random() * 500) + 500;
    setTimeout(resolve, delay);
  });
}

// GET /volumes?q={query}&startIndex={index}&maxResults={count}
app.get('/volumes', async (req, res) => {
  await randomDelay();

  const q = (req.query.q || '').toLowerCase().trim();
  const startIndex = parseInt(req.query.startIndex, 10) || 0;
  const maxResults = parseInt(req.query.maxResults, 10) || 20;

  let items = booksData.items || [];

  // Filter by query if provided
  if (q) {
    items = items.filter(item => {
      const title = (item.volumeInfo.title || '').toLowerCase();
      const authors = (item.volumeInfo.authors || []).join(' ').toLowerCase();
      return title.includes(q) || authors.includes(q);
    });
  }

  const totalItems = items.length;
  const paginatedItems = items.slice(startIndex, startIndex + maxResults);

  res.json({
    kind: 'books#volumes',
    totalItems,
    items: paginatedItems
  });
});

// GET /volumes/:id
app.get('/volumes/:id', async (req, res) => {
  await randomDelay();

  const { id } = req.params;
  const item = (booksData.items || []).find(i => i.id === id);

  if (!item) {
    return res.status(404).json({
      error: { code: 404, message: 'Volume not found' }
    });
  }

  res.json(item);
});

// GET /volumes/:id/related — Returns random books as "related" (simulates a slow recommendation engine)
app.get('/volumes/:id/related', async (req, res) => {
  // Simulate a slower response for the related books (recommendation engine)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const { id } = req.params;
  const allItems = booksData.items || [];

  // Pick 5 random books that aren't the current one
  const others = allItems.filter(i => i.id !== id);
  const shuffled = others.sort(() => Math.random() - 0.5);
  const related = shuffled.slice(0, 5);

  res.json({
    kind: 'books#volumes',
    totalItems: related.length,
    items: related
  });
});

app.listen(PORT, () => {
  console.log(`📚 Mock Google Books API running at http://localhost:${PORT}`);
  console.log(`   GET /volumes?q={query}&startIndex={n}&maxResults={n}`);
  console.log(`   GET /volumes/:id`);
});
