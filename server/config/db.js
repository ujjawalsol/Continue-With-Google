const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI) // Use the MONGODB_URI variable from .env
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error: ', err));