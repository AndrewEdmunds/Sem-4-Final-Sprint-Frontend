const express = require('express');
const router = express.Router();


// root page (signup)
router.get('/', (req, res) => {
  res.render('signup', { errorMessage: req.flash('error'), successMessage: req.flash('success'), currentUser: res.locals.currentUser });
});
// main page
router.get('/landing', (req, res) => {

  const currentUser = req.query.currentUser ? JSON.parse(req.query.currentUser) : null;
  
  res.render('landing', { currentUser });
});

module.exports = router;