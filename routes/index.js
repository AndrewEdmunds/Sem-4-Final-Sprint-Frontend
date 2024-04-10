const express = require('express');
const router = express.Router();


// root page (signup)
router.get('/', (req, res) => {
  res.render('signup', { errorMessage: req.flash('error'), successMessage: req.flash('success'), currentUser: res.locals.currentUser });
});
// main page
router.get('/landing', (req, res) => {
  res.render('landing', {currentUser: res.locals.currentUser})
});

module.exports = router;
