const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
require('./config/db');
const sessionConfig = require('./config/session');
const cacheControl = require('./middlewares/cacheControl');
const limiter = require('./middlewares/rateLimiter');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const logoutRoutes = require('./routes/logout');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(sessionConfig);
app.use(cacheControl);
app.use(csurf({ cookie: true }));
app.use(limiter);
app.use(authRoutes);
app.use(userRoutes);
app.use(logoutRoutes);
// Add a global error handler.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(9000, () => console.log('Server running on port 9000'));