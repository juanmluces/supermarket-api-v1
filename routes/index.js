const express = require('express');
const router = express.Router();

/* GET home page. */

router.get('/es', function(req, res, next) {
  res.render('index', { title: 'Supermarket API' });
});
router.get('/en', function(req, res, next) {
  res.render('index-en', { title: 'Supermarket API' });
});
router.get('/', function(req, res, next) {
  res.redirect('es')
  // res.render('index', { title: 'Supermarket API' });
});

module.exports = router;
