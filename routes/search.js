const express = require('express');  // Import the Express framework
const router = express.Router();     // Create a router instance



// Search route
router.get('/', async (req, res) => {
  const currentUser = req.session.currentUser;

  try {
    res.render('search_results', { currentUser }); // Render the search results page
  } catch (err) {
    console.error('Error executing search query:', err); // Handle any errors that occur
    res.send('An error occurred while searching.'); // Send an error response
  }
});

module.exports = router; // Export the router for use in other modules







