const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
console.log(process.env.FRONTEND_URL);
// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Validate environment variables
const requiredEnvVars = ['MONGO_URI', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Configure express-session middleware
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true for HTTPS in production
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// User Model
const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  emails: [{
    subject: { type: String, required: true },
    body: { type: String, required: true },
    tag: { type: String, default: 'Uncategorized' }
  }]
});
const User = mongoose.model('User', UserSchema);

// Passport session serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) return done(new Error('User not found'));
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if (!profile.id) throw new Error('Google profile ID missing');
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName || 'Unknown User',
        emails: [
          { subject: 'Welcome Email', body: 'Hello, this is a test.' },
          { subject: 'Sale Alert', body: 'Big sale on products!' },
          { subject: 'Urgent Update', body: 'Action required urgently.' },
          { subject: 'Welcome Email', body: 'Hello, this is a test.' },
          { subject: 'Sale Alert', body: 'Big sale on products!' },
          { subject: 'Urgent Update', body: 'Action required urgently.' },
          { subject: 'Welcome Email', body: 'Hello, this is a test.' },
          { subject: 'Sale Alert', body: 'Big sale on products!' },
          { subject: 'Urgent Update', body: 'Action required urgently.' },
           { subject: 'Welcome Email', body: 'Hello, this is a test.' },
          { subject: 'Sale Alert', body: 'Big sale on products!' },
          { subject: 'Urgent Update', body: 'Action required urgently.' },
          { subject: 'Welcome Email', body: 'Hello, this is a test.' },
          { subject: 'Sale Alert', body: 'Big sale on products!' },
          { subject: 'Urgent Update', body: 'Action required urgently.' },
          { subject: 'Welcome Email', body: 'Hello, this is a test.' },
          { subject: 'Sale Alert', body: 'Big sale on products!' },
          { subject: 'Urgent Update', body: 'Action required urgently.' }
        ]
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    console.error('Google auth error:', err.message);
    done(err);
  }
}));
// logout route
app.get('/logout', (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error('Backend: Logout error:', err.message);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Backend: Session destroy error:', err.message);
          return res.status(500).json({ error: 'Failed to destroy session' });
        }
        console.log('Backend: User logged out, session destroyed');
        res.json({ message: 'Logged out successfully' });
      });
    });
  } catch (err) {
    console.error('Backend: Logout route error:', err.message);
    res.status(500).json({ error: 'Server error during logout' });
  }
});

// Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  failureFlash: true
}), (req, res) => {
  try {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
  } catch (err) {
    console.error('JWT signing error:', err.message);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Email Routes
app.get('/emails', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.emails);
  } catch (err) {
    console.error('Error fetching emails:', err.message);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

app.post('/classify', verifyToken, async (req, res) => {
  try {
    const { numEmails } = req.body;
    if (!Number.isInteger(numEmails) || numEmails <= 0) {
      return res.status(400).json({ error: 'Invalid number of emails' });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const emailsToClassify = user.emails.slice(0, numEmails);
    if (emailsToClassify.length === 0) {
      return res.status(400).json({ error: 'No emails to classify' });
    }
    emailsToClassify.forEach(email => {
      if (email.body.includes('sale')) email.tag = 'Marketing';
      else if (email.body.includes('urgent')) email.tag = 'Important';
      else email.tag = 'Other';
    });
    await user.save();
    res.json({ message: 'Emails classified successfully', emails: user.emails });
  } catch (err) {
    console.error('Error classifying emails:', err.message);
    res.status(500).json({ error: 'Failed to classify emails' });
  }
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// Start server with error handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server start error:', err.message);
  process.exit(1);
});