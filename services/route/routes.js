var app = require(__base + 'app.js').app

var user = require(__base + 'services/profile/user.js')
var question = require(__base + 'services/profile/question.js')
var sample = require(__base + 'services/profile/sample.js')

//---------------------------------------------
//----------------- POST ----------------------
//---------------------------------------------
/**
* Create a question
*/
app.post('/question/create', function(request, response) {
	question.createQuestion(request,response);
})

/**
* Create a sample
*/
app.post('/sample/petridish/create', function(request, response) {
	sample.createPetriDishSample(request,response);
})

//---------------------------------------------
//------------------- GET ---------------------
//---------------------------------------------
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

/**
* Get specific petri dish sample
*/
app.get('/sample/petridish/specific', function(request, response) {
	sample.specificPetriDishSample(request,response);
})

//---------------------------------------------
//------------------- PUT ---------------------
//---------------------------------------------

/**
* Update a question
*/
app.put('/question/answer', function(request, response) {
	question.answerQuestion(request,response);
})