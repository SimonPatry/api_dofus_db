const https = require('https');

// Wrap the HTTPS request in a Promise
const loadData = (skip, step) => {
  return new Promise((resolve, reject) => {
    let data = '';

    https.get(`https://api.dofusdb.fr/quests?$skip=${skip}$limit=${step}&lang=fr`, (apiRes) => {
      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        try {
          // Resolve with the complete data
          resolve(data);
        } catch (e) {
          // Reject the Promise if there's an error
          reject(new Error('Error parsing JSON: ' + e.message));
        }
      });

    }).on('error', (e) => {
      // Reject the Promise on HTTP request error
      reject(new Error('HTTP request failed: ' + e.message));
    });
  });
};

const fetchData = async () => {
  const max = 2000
  const step = 50;
  const data = []
  for (let i = 0; i < max; i += step) {
    try {
      const res = await loadData(i, step);
      data.push(...JSON.parse(res).data);
    } catch (error) {
      console.error('Error occurred:', error.message);
    }
  }
  return data
};

module.exports = {
  loadData,
  fetchData,
};