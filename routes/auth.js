const express = require('express');
const router = express.Router();
const axios = require('axios'); // Import axios to make HTTP requests to the Spring Boot backend

// Render the signup page (if applicable, remove if frontend is handling views)
router.get('/signup', (req, res) => {
  res.render('signup', { errorMessage: req.flash('error'), successMessage: req.flash('success') });
});

// Handle form submission for user signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Send signup data to Spring Boot backend
    const response = await axios.post('http://localhost:8080/api/signup', { username, email, password }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    console.log(response.data); // This will log the string response
    
    req.flash('success', response.data); // Use the response directly without parsing as JSON

    // Redirect to login page (if applicable)
    res.redirect('/login');
  } catch (error) {
    // Handle errors
    if (error.response) {
      // Server responded with an error status code (e.g., 400, 500)
      req.flash('error', error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Error during signup:', error.request);
      req.flash('error', 'An error occurred during signup.');
    } else {
      // Something else went wrong
      console.error('Error during signup:', error.message);
      req.flash('error', 'An error occurred during signup.');
    }

    // Redirect back to signup page with error message
    res.redirect('/signup');
  }
});

// Render the login page (if applicable, remove if frontend is handling views)
router.get('/login', (req, res) => {
  res.render('login', { errorMessage: req.flash('error'), successMessage: req.flash('success'), currentUser: res.locals.currentUser });
});

// Handle form submission for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Send login data to Spring Boot backend
    const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
    console.log("login response: ", response.data);

    const token = response.data; // Response should only contain the token
    console.log(response.body);

    if (token) {
      // Store token in local storage
      localStorage.setItem('token', token);

      // Fetch user information separately using the token
      const userResponse = await axios.get('http://localhost:8080/api/auth/status', {
        headers: {
          'Authorization': `Bearer ${token}` // Include token in the request headers
        }
      });

      const user = userResponse.data.username; // Extract username from user response

      // Store user information in local storage
      localStorage.setItem('user', JSON.stringify(user));
    }

    // Display success message (if applicable)
    req.flash('success', 'Login successful');

    // Redirect to landing page (if applicable)
    res.redirect(`/landing?currentUser=${JSON.stringify(currentUser)}`);
  } catch (error) {
    // Handle errors
    console.error('Error during login:', error);

    if (error.response) {
      // Server responded with an error status code (e.g., 400, 500)
      req.flash('error', error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Error making login request:', error.request);
      req.flash('error', 'An error occurred during login.');
    } else {
      // Something else went wrong
      console.error('Error during login:', error.message);
      req.flash('error', 'An error occurred during login.');
    }

    // Redirect back to login page with error message
    res.redirect('/login');
  }
});

// Handle user logout (if applicable)
router.get('/logout', (req, res) => {
  // Send logout request to Spring Boot backend
  axios.get('http://localhost:8080/api/logout')
    .then(() => {
      // Session destroyed successfully
      // Redirect to logout page or perform other actions as needed
      res.render('logout');
    })
    .catch(error => {
      console.error('Error destroying session:', error);
      // Handle error while destroying session
      res.render('error'); // Render an error page or redirect to home page
    });
});

// Export the router
module.exports = router;
