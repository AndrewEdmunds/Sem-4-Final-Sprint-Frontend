
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
app.use(authMiddleware);

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Import the route handlers
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const searchRoutes = require('./routes/search');

// Use the imported route handlers for specific paths
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/search', searchRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
