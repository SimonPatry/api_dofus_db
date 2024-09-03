const express = require('express');
const https = require('https');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware to set headers
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/data', (req, res) => {
  let data = '';
  https.get('https://api.dofusdb.fr/quests?$limit=200&lang=fr', (apiRes) => {
    apiRes.on('data', (chunk) => {
      data += chunk;
    });
    apiRes.on('end', () => {
      try {
        res.status(200).json(JSON.parse(data));
      } catch (e) {
        res.status(500).send('Error while parsing data from API');
      }
    });
  }).on('error', (e) => {
    res.status(500).send('Error fetching data from API');
  });
});

// 404 route for undefined paths
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
