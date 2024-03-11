const express = require('express');
const router = express.Router();

router.get('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out, please try again' });
    } else {
      // Clear the cookies
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      return res.status(200).json({ message: 'Logged out' });
    }
  });
});

module.exports = router;