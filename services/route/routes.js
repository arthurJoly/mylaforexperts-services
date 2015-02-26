var app = require(__base + 'app.js').app

var user = require(__base + 'services/profile/user.js')

/* GET home page. */
app.get('/test', function(req, res, next) {
  res.send('Hello');
});

/**
* Login an user
*/
app.get('/getUser', function(request, response) {
	user.getAll(request,response);
})
/**
* Register an user
*/
app.post('/postUser', function(request, response) {
	user.registerUser(request,response);
})