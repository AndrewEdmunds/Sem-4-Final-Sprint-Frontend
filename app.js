
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const authMiddleware = require('./authMiddleware');

// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Session configuration for managing user sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware for handling flash messages
app.use(flash());

// Middleware for authenticating user and storing user data in locals
app.use((req, res, next) => {
  // Check if user session exists
  if (req.session && req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    // Check if token exists in request headers
    const token = req.headers.authorization; // Assuming Bearer token format
    if (token) {
      // Use token to fetch user information from backend
      axios.get(`http://localhost:8080/api/auth/status`, {
        headers: {
          'Authorization': token
        }
      })
      .then(response => {
        // Extract user data from response and assign to req.user
        req.user = response.data.username;
        next();
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        next(error); // Pass error to error handling middleware
      });
    } else {
      next(); // Proceed to next middleware without user data
    }
  }
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Import the route handlers
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const searchRoutes = require('./routes/search');

// Use the imported route handlers for specific paths
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/search', searchRoutes);

app.get('/api/auth/status', (req, res) => {
  if (req.user) {
    // User is authenticated
    res.json({
      isAuthenticated: true,
      username: req.user.username, // Assuming req.user contains user information
    });
  } else {
    // User is not authenticated
    res.json({
      isAuthenticated: false,
      username: null,
    });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});