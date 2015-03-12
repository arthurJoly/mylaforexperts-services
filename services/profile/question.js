var Question = require(__base + 'services/database/model.js').Question
var Sample = require(__base + 'services/database/model.js').Sample
var PetriDishSample = require(__base + 'services/database/model.js').PetriDishSample

var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose

module.exports.createQuestion = function(request,response) {
	//TODO : change the way we get the sample id
	PetriDishSample.find({}, function(err, petridishSamples){
		var question = new Question({
			text : request.body.text,
			date : request.body.date,
			answered : false,
			sample : petridishSamples[petridishSamples.length-1]._id
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
	 Question.find({answered : false},'-sample -__v',function(err, questions){
		if (err)
			utils.httpResponse(response,500,err)
		else
			utils.httpResponse(response,200,'Questions successfully found',questions)
	});
}

module.exports.specificQuestion = function(request,response) {
	Question.findById(mongoose.Types.ObjectId(request.query.questionId))
		.populate('sample')
		.exec(function(err, obj){
			if(err){
				utils.httpResponse(response,404,'Question not found')
			}
			else{
				utils.httpResponse(response,200,'Question successfully found',obj)
			}				
		})
}

module.exports.answerQuestion = function(request,response) {
	Question.findOne({_id: mongoose.Types.ObjectId(request.body.questionId)}, function (err, question) {
		if(err){
			utils.httpResponse(response,404,'Question not found')
		} else {
			if (question) {
				question.answered = true;
				
				PetriDishSample.findOne({_id : question.sample}, function(err, petridishSample){
					if(petridishSample){
						petridishSample.isolates = request.body.isolates;
						petridishSample.image.texts = request.body.texts;
						petridishSample.image.lines =request.body.lines;
						petridishSample.save();
					}
				})
							
				question.save();
				utils.httpResponse(response, 200, 'Question successfully modified')
			} else{
				utils.httpResponse(response, 500, 'Question not found')
			}
		}		
	});
}



