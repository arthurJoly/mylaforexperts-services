var app = require(__base + 'app.js').app
var restrict = require(__base + 'services/utils/utils.js').restrict

var user = require(__base + 'services/profile/user.js')
var feed = require(__base + 'services/profile/feed.js')
var sample = require(__base + 'services/profile/sample.js')
var patient = require(__base + 'services/profile/patient.js')
var registration = require(__base + 'services/profile/registration.js')

//---------------------------------------------
//----------------- POST ----------------------
//---------------------------------------------

//------------ USERS ---------------
/**
* Create an user
*/
app.post('/user/register', function(request, response) {
	user.registerUser(request,response);
})

/**
* Login an user
*/
app.post('/user/login', function(request, response) {
	user.loginUser(request,response);
})

//------------ FEEDS ---------------
/**
* Create a question
*/
app.post('/question/create', function(request, response) {
	feed.createQuestion(request,response);
})

/**
* Create a validation
*/
app.post('/validation/create', function(request, response) {
	feed.createValidation(request,response);
})

//------------ SAMPLES ---------------
/**
* Create a petridish sample
*/
app.post('/sample/petridish/create', function(request, response) {
	sample.createPetriDishSample(request,response);
})

/**
* Create a validation sample
*/
app.post('/sample/validationSample/create', function(request, response) {
	sample.createValidationSample(request,response);
})

//------------ PATIENTS ---------------
/**
* Create a patient
*/
app.post('/patient/create', function(request, response) {
	patient.createPatient(request,response);
})

//------------ NOTIFICATION REGISTRATION ---------------
/**
* Store registration Id in database
*/
app.post('/notification/registration/create', function(request, response) {
	registration.createRegistration(request,response);
})

//---------------------------------------------
//------------------- GET ---------------------
//---------------------------------------------

//------------ USERS ---------------
/**
 * Logout an user
 */
app.get('/user/logout', restrict, function(request, response) {
    user.logoutUser(request,response);
})

//------------ FEEDS ---------------
/**
* Get all feeds
*/
app.get('/feed/overview', function(request, response) {
	feed.feedOverview(request,response);
})

/**
* Get all questions
*/
app.get('/question/overview', function(request, response) {
	feed.questionOverview(request,response);
})

/**
* Get all validations
*/
app.get('/validation/overview', function(request, response) {
	feed.validationOverview(request,response);
})

/**
* Get questions that have been answered
*/
app.get('/question/history', function(request, response) {
	feed.questionHistory(request,response);
})

/**
* Get questions that have been answered given some criteria
*/
app.get('/question/history/search', function(request, response) {
	feed.questionHistorySearch(request,response);
})

/**
* Get specific question
*/
app.get('/question/specific', function(request, response) {
	feed.specificQuestion(request,response);
})

/**
* Get specific validation
*/
app.get('/validation/specific', function(request, response) {
	feed.specificValidation(request,response);
})

/**
* Get comment list of a question
*/
app.get('/question/comment', function(request, response) {
	feed.getQuestionComment(request,response);
})

/**
* Get comment list of a validation
*/
app.get('/validation/comment', function(request, response) {
	feed.getValidationComment(request,response);
})

//------------ SAMPLES ---------------
/**
* Get all samples
*/
app.get('/sample/overview', function(request, response) {
	sample.sampleOverview(request,response);
})

/**
* Get specific petridish sample
*/
app.get('/sample/petridish/specific', function(request, response) {
	sample.specificPetriDishSample(request,response);
})

/**
* Get specific validation sample
*/
app.get('/sample/validation/specific', function(request, response) {
	sample.specificValidationSample(request,response);
})

//------------ PATIENTS ---------------
/**
* Get all patient
*/
app.get('/patient/overview', function(request, response) {
	patient.patientOverview(request,response);
})

/**
* Get specific patient
*/
app.get('/patient/specific', function(request, response) {
	patient.specificPatient(request,response);
})

/**
* Get patients that have matched some criteria
*/
app.get('/patient/search', function(request, response) {
	patient.patientSearch(request,response);
})

//---------------------------------------------
//------------------- PUT ---------------------
//---------------------------------------------

//------------ FEEDS ---------------
/**
* Update a question
*/
app.put('/question/answer', function(request, response) {
	feed.answerQuestion(request,response);
})

/**
* Update a validation
*/
app.put('/validation/answer', function(request, response) {
	feed.answerValidation(request,response);
})

/**
* Add a comment to a question
*/
app.put('/question/comment', function(request, response) {
	feed.commentQuestion(request,response);
})

/**
* Add a comment to a validation
*/
app.put('/validation/comment', function(request, response) {
	feed.commentValidation(request,response);
})