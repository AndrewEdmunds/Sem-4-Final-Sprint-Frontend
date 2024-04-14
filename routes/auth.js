const express = require('express');
const router = express.Router();
const axios = require('axios');

// Render the signup page
router.get('/signup', (req, res) => {
  res.render('signup', { errorMessage: req.flash('error'), successMessage: req.flash('success') });
});

// Render the login page
router.get('/login', (req, res) => {
  res.render('login', { errorMessage: req.flash('error'), successMessage: req.flash('success') });
});

router.get('/logout', (req, res) => {
  res.render('logout', { errorMessage: req.flash('error'), successMessage: req.flash('success') });
});

module.exports = router;
