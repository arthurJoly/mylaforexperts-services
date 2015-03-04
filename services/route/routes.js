var app = require(__base + 'app.js').app

var user = require(__base + 'services/profile/user.js')
var question = require(__base + 'services/profile/question.js')

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

/**
* Create a question
*/
app.post('/question/create', function(request, response) {
	question.createQuestion(request,response);
})


/**
* Get all question
*/
app.get('/question/overview', function(request, response) {
	question.questionOverview(request,response);
})

/**
* Get specific question
*/
app.get('/question/specific', function(request, response) {
	question.specificQuestion(request,response);
})