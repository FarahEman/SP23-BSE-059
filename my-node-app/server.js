const express = require('express');
const path = require('path');
const app = express();

// Set the views folder
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the public directory (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to render the index page
app.get('/', (req, res) => {
    res.render('index', { title: 'Khaadi Pakistan' }); // Renders index.ejs with the title variable
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
