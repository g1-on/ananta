const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import the API routes we created
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3000; // The port our server will run on

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable the express server to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Database Connection ---
// Connect to your local MongoDB instance.
// 'project-ananta-db' is the name of the database that will be created.
const MONGO_URI = 'mongodb://127.0.0.1:27017/project-ananta-db';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit the application if the DB connection fails
    });

// --- API Routes ---
// Tell the server to use our API routes for any request starting with /api
app.use('/api', apiRoutes);

// --- Serve Static Files ---
// This tells Express to serve all files from the 'public' directory (index.html, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// A catch-all to send the main HTML file for any other requests.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Open this URL in your browser to see the website.');
});
