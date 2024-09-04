const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
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

app.get('setquestsLevel', (res, req) => {
  function getQuestLevel(item) {
    const critQuests = [];
    let ids = extractQfValues(item.startCriterion);
    
    while (ids.length > 0) {
        const id = ids.shift();
        const critQuest = data["data"].find(q => q.id === id);
        
        if (critQuest) {
            critQuests.push(critQuest);
            ids = ids.concat(extractQfValues(critQuest.startCriterion));
        }
    }

    return critQuests.length
  }

  let data = '';
  https.get('https://api.dofusdb.fr/quests?$limit=200&lang=fr', (apiRes) => {
    apiRes.on('data', (chunk) => {
      data += chunk;
    });
    apiRes.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        const quests = data.data.map((q) => {
          q.depth = getQuestLevel(q)
          return q
        })
        // Write quests to a JSON file
        fs.writeFile('quests.json', JSON.stringify(quests, null, 2), (err) => {
          if (err) {
            console.error('Error writing to file', err);
            res.status(500).send('Error while writing data to file');
          } else {
            console.log('Data successfully written to quests.json');
            res.status(200).send('Data successfully written to file');
          }
        });
      } catch (e) {
        res.status(500).send('Error while parsing data from API');
      }
    });
  }).on('error', (e) => {
    res.status(500).send('Error fetching data from API');
  });


})

// 404 route for undefined paths
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
