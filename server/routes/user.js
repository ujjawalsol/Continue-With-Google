const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwtMiddleware = require('../middlewares/auth');

router.get('/api/current_user', jwtMiddleware, (req, res, next) => {
    User.findById(req.user)
        .then(user => {
            res.cookie('XSRF-TOKEN', req.csrfToken());
            res.send(user);
        })
        .catch(err => {
            console.error(err);
            next(err); // Pass the error to the next middleware (which should be your error handling middleware)
        });
});

module.exports = router;