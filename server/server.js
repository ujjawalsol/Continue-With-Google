const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
require('dotenv').config();


const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI); // Use the MONGODB_URI variable from .env

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET, // Use the SESSION_SECRET variable from .env
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Use the GOOGLE_CLIENT_ID variable from .env
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Use the GOOGLE_CLIENT_SECRET variable from .env
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ googleId: profile.id }).then(existingUser => {
    if (existingUser) {
      done(null, existingUser);
    } else {
      new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        profilePic: profile.photos[0].value
      }).save().then(user => done(null, user));
    }
  });
}));

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  try {
    const privateKey = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf8');
    const token = jwt.sign({ userId: req.user.id }, privateKey, { algorithm: 'RS256' });
    res.cookie('access_token', token, { httpOnly: true });
    res.cookie('refresh_token', token, { httpOnly: true });
    res.redirect('http://localhost:5173/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});




app.get('/api/logout', (req, res) => {
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

const jwtMiddleware = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (accessToken && refreshToken) {
    const publicKey = fs.readFileSync(path.join(__dirname, 'public.key'), 'utf8');
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
              const privateKey = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf8');
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
};


app.use(csurf({ cookie: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.get('/api/current_user', jwtMiddleware, (req, res) => {
  User.findById(req.user).then(user => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send(user);
  });
});

app.listen(9000, () => console.log('Server running on port 9000'));