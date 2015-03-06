var Question = require(__base + 'services/database/model.js').Question
var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose

module.exports.createQuestion = function(request,response) {
	var question = new Question({
		text : request.body.text,
		date : request.body.date,
		sample : { specimenType : 0}
	});

	question.save(function(err) {
		if (err)
			utils.httpResponse(response,500,err)
		else
			utils.httpResponse(response,200,'Question successfully created')
	});
}

module.exports.questionOverview = function(request,response) {
	 Question.find(function(err, questions){
		if (err)
			utils.httpResponse(response,500,err)
		else
			utils.httpResponse(response,200,'Questions successfully found',questions)
	});
}

module.exports.specificQuestion = function(request,response) {
	Question.findById(mongoose.Types.ObjectId(request.query.questionId), function(err, obj) {
	if (obj)
		utils.httpResponse(response,200,'Question successfully found',obj)
	else
		utils.httpResponse(response,500,'Question not found')
	});
}