const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors'); 

const app = express();

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');

// Connexion to MongoDB, Cluster 0
mongoose.connect('mongodb+srv://visitor:ickI98YeFKJbwzh7@cluster0.s8f2adz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', 
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie :) !'))
    .catch(() => console.log('Connexion à MangoDB échouee :( !'));
    

//To avoid CORS
app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
//   });

app.use('/api/auth', userRoutes); 
app.use('/api/books', bookRoutes);

module.exports = app;