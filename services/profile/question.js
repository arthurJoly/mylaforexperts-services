var Question = require(__base + 'services/database/model.js').Question
var Sample = require(__base + 'services/database/model.js').Sample
var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose

module.exports.createQuestion = function(request,response) {
	Sample.find({}, function(err, samples){
		var question = new Question({
			text : request.body.text,
			date : request.body.date,
			sample : samples[samples.length-1]._id
		});

		question.save(function(err) {
			if (err)
				utils.httpResponse(response,500,err)
			else
				utils.httpResponse(response,200,'Question successfully created')
		});
	});
}

module.exports.questionOverview = function(request,response) {
	 Question.find('-sample -__v',function(err, questions){
		if (err)
			utils.httpResponse(response,500,err)
		else
			utils.httpResponse(response,200,'Questions successfully found',questions)
	});
}

module.exports.specificQuestion = function(request,response) {
	/*Question.findById(mongoose.Types.ObjectId(request.query.questionId), function(err, obj) {
	if (obj)
		utils.httpResponse(response,200,'Question successfully found',obj)
	else
		utils.httpResponse(response,500,'Question not found')
	});*/
	Question.findById(mongoose.Types.ObjectId(request.query.questionId))
			.populate('sample')
			.exec(function(err, obj){
				if(err)
					utils.httpResponse(response,500,'Question not found')
				else
					utils.httpResponse(response,200,'Question successfully found',obj)
			})
}