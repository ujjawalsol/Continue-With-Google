const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const jwtMiddleware = (req, res, next) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    try {
        const publicKey = fs.readFileSync(path.join(__dirname, '../public.key'), 'utf8');

        if (accessToken && refreshToken) {
            jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        // The access token is expired. Try to refresh it.
                        jwt.verify(refreshToken, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
                            if (err) {
                                // The refresh token is also invalid or expired. The user needs to log in again.
                                res.status(401).send('Unauthorized: Invalid token');
                            } else {
                                // The refresh token is valid. Generate a new access token and continue.
                                const privateKey = fs.readFileSync(path.join(__dirname, '../private.key'), 'utf8');
                                const newAccessToken = jwt.sign({ userId: decoded.userId }, privateKey, { algorithm: 'RS256' });
                                res.cookie('access_token', newAccessToken, { httpOnly: true });
                                req.user = decoded.userId;
                                next();
                            }
                        });
                    } else {
                        // The access token is invalid for a reason other than expiration.
                        console.error(err);
                        res.status(401).send('Unauthorized: Invalid token');
                    }
                } else {
                    // The access token is valid. Continue.
                    req.user = decoded.userId;
                    next();
                }
            });
        } else {
            res.status(401).send('Unauthorized: No token provided');
        }
    } catch (err) {
        console.error('Error reading key files:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = jwtMiddleware;