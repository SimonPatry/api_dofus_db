const express = require('express');
const app = express();
const PORT = 4000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware to serve static files like CSS, JS, images, etc.
app.use(express.static('public'));


const { fetchData } = require('./javascript/loadData');


// Route to render the homepage
app.get('/', async (req, res) => {
    const data = await fetchData();
    res.render('index', {data});
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
