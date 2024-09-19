const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const cors = require('cors'); 
require('dotenv').config();

const authToken = process.env.AUTH_TOKEN;
const dbAccessKey = process.env.DB_ACCESS_KEY;
console.log(`Auth Token: ${authToken}`);
console.log(`Database Access Key: ${dbAccessKey}`);

const app = express();
app.use(express.json());
app.use(bodyParser.xml());

const userRoutes = require('./routes/user.router');
const bookRoutes = require('./routes/book.router');

// Connexion to MongoDB, Cluster 0
mongoose.connect(dbAccessKey)
    .then(() => console.log('Connexion à MongoDB réussie :) !'))
    .catch(() => console.log('Connexion à MangoDB échouee :( !'));
    

//To avoid CORS
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/auth', userRoutes); 
app.use('/api/books', bookRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;