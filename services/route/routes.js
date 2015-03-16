var app = require(__base + 'app.js').app

var user = require(__base + 'services/profile/user.js')
var question = require(__base + 'services/profile/question.js')
var sample = require(__base + 'services/profile/sample.js')
var patient = require(__base + 'services/profile/patient.js')
var registration = require(__base + 'services/profile/registration.js')

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
* Create a patient
*/
app.post('/patient/create', function(request, response) {
	patient.createPatient(request,response);
})


/**
* Store registration Id in database
*/
app.post('/notification/registration/create', function(request, response) {
	registration.createRegistration(request,response);
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
* Get questions that have been answered
*/
app.get('/question/history', function(request, response) {
	question.questionHistory(request,response);
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
* Get specific patient
*/
app.get('/patient/specific', function(request, response) {
	patient.specificPatient(request,response);
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