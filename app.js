// db.js

const express = require('express');
const bodyParser = require('body-parser');
const Database = require('./db/db');
const path=require('path')


const app = express();
const port = 3000; // Change this to your preferred port number
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// Endpoint to save coordinates to the database
app.post('/save-coordinates', (req, res) => {
  const { latitude, longitude } = req.body; // Extract coordinates from the request body

  // Use the received latitude and longitude in the MongoDB aggregation query
  Database().then((db) => {
    let collection = db.collection('spatialData');
    collection
      .aggregate([
        {
          $match: {
            'Load Capacity': { $lt: 5 },
          },
        },
        {
          $project: {
            'Pole ID': 1,
            Latitude: 1,
            Longitude: 1,
            'Load Capacity': 1,
            distance: {
              $sqrt: {
                $add: [
                  { $pow: [{ $subtract: ['$Latitude', latitude] }, 2] },
                  { $pow: [{ $subtract: ['$Longitude', longitude] }, 2] },
                ],
              },
            },
          },
        },
        {
          $sort: {
            distance: 1,
          },
        },
      ]).toArray()
      .then((result) => {
        res.json(result); // Send the result as JSON response
      })
      .catch((err) => {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred' });
      })
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
