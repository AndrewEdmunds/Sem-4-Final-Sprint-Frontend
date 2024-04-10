const db = require('./models/db');

// This middleware function is used to fetch user information based on userId stored in the session
module.exports = async (req, res, next) => {
  try {
    // Check if the user is authenticated (userId is stored in the session)
    if (req.session.userId) {
      // Query the database to get the user's username using userId
      const result = await db.query('SELECT username FROM users WHERE id = $1', [
        req.session.userId,
      ]);

      // If a user with the given userId exists
      if (result.rows.length > 0) {
        // Store user information in req.user and res.locals.currentUser
        req.user = { id: req.session.userId, username: result.rows[0].username };
        res.locals.currentUser = result.rows[0].username;
      }
    } else {
      // If not authenticated, set req.user and res.locals.currentUser to null
      req.user = null;
      res.locals.currentUser = null;
    }
  } catch (err) {
    // Handle errors that might occur during user fetching
    console.error('Error fetching user:', err);
  }

  // Continue to the next middleware or route handler
  next();
};
