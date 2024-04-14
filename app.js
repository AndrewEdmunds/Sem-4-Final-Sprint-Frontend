const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');


const flash = require('connect-flash');
const axios = require('axios');

// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));


// Session configuration for managing user sessions
app.use(
  session({
    secret: 'default-secret',
    resave: false,
    saveUninitialized: true,
  })
);


// Middleware for handling flash messages
app.use(flash());

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


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});