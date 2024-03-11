const session = require('express-session');

if (!process.env.SESSION_SECRET) {
    console.error('SESSION_SECRET is not set');
    process.exit(1);
}

const sessionConfig = session({
    secret: process.env.SESSION_SECRET, // Use the SESSION_SECRET variable from .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});

module.exports = sessionConfig;