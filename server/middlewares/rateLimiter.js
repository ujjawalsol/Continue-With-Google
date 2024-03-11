const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    handler: function (req, res) {
        res.status(429).send('Too many requests, please try again later.');
    }
});

module.exports = limiter;