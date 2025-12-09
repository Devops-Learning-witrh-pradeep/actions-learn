const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files. Prefer `dist` if it exists (artifact build), else fall back to `public` (local dev)
const fs = require('fs');
const staticFolder = fs.existsSync(path.join(__dirname, 'dist')) ? 'dist' : 'public';
app.use(express.static(path.join(__dirname, staticFolder)));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node server' });
});

if (require.main === module) {
  app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
}

module.exports = app;
