var app = require(__base + 'app.js').app

var user = require(__base + 'services/profile/user.js')
var question = require(__base + 'services/profile/question.js')
var sample = require(__base + 'services/profile/sample.js')
var isolate = require(__base + 'services/profile/isolate.js')

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

/**
* Create an isolate
*/
app.post('/isolate/create', function(request, response) {
	isolate.createIsolate(request,response);
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


/**
* Get specific isolate
*/
app.get('/isolate/specific', function(request, response) {
	isolate.specificIsolate(request,response);
})


//---------------------------------------------
//------------------- PUT ---------------------
//---------------------------------------------

/**
* Update a question
*/
app.post('/question/answer', function(request, response) {
	question.answerQuestion(request,response);
})