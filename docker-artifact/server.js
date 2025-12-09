const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

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
