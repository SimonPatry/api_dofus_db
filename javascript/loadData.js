const https = require('https');

// Wrap the HTTPS request in a Promise
const loadData = () => {
  return new Promise((resolve, reject) => {
    let data = '';

    https.get('https://api.dofusdb.fr/quests?$limit=200&lang=fr', (apiRes) => {
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
  try {
    const data = await loadData();
    return JSON.parse(data).data;
  } catch (error) {
    console.error('Error occurred:', error.message);
    return [];
  }
};

module.exports = {
  loadData,
  fetchData
};