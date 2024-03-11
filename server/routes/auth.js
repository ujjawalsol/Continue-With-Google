const express = require('express');
const router = express.Router();
const passport = require('../config/passportSetup');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res, next) => {
    try {
        const privateKey = fs.readFileSync(path.join(__dirname, '../private.key'), 'utf8');
        const token = jwt.sign({ userId: req.user.id }, privateKey, { algorithm: 'RS256' });
        res.cookie('access_token', token, { httpOnly: true });
        res.cookie('refresh_token', token, { httpOnly: true });
        res.redirect('http://localhost:5173/dashboard');
    } catch (err) {
        console.error(err);
        next(err); // Pass the error to the next middleware (which should be your error handling middleware)
    }
});

module.exports = router;