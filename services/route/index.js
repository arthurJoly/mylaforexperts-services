var express = require('express');
var router = express.Router();
var user = require(__base + 'profile/user.js')
var app = require(__base + 'app.js').app

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/test', function(req, res, next) {
  res.send('Hello');
});


router.get('/getUser', function(request, response) {
	user.getAll(request,response);
})

/**
* Register an user
*/
router.post('/postUser', function(request, response) {
	user.registerUser(request,response);
})

module.exports = router;
