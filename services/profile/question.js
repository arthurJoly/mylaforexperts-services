var Question = require(__base + 'services/database/model.js').Question
var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')

module.exports.questionOverview = function(request,response) {
	 Question.find(function(err, questions){
		utils.httpResponse(response,200,'qeustions successfully found',questions)
	});
}

module.exports.createQuestion = function(request,response) {
	var question = {
		text : request.body.text
	}

	question.save() 
	utils.httpResponse(response,200,'Question successfully created')
}