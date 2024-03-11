const cacheControl = (req, res, next) => {
    try {
        res.set('Cache-Control', 'no-store');
        next();
    } catch (err) {
        console.error('Error setting Cache-Control header:', err);
        next(err);
    }
};

module.exports = cacheControl;