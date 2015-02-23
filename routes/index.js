var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET test. */
router.get('/test', function(req, res) {
  res.send('Bonjour services');
});

module.exports = router;
