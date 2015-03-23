var Feed = require(__base + 'services/database/model.js').Feed
var Question = require(__base + 'services/database/model.js').Question
var Validation = require(__base + 'services/database/model.js').Validation
var Sample = require(__base + 'services/database/model.js').Sample
var PetriDishSample = require(__base + 'services/database/model.js').PetriDishSample
var ValidationSample = require(__base + 'services/database/model.js').ValidationSample

var uuid = require('node-uuid')
var hashMap = require('hashmap')
var utils = require(__base + 'services/utils/utils.js')
var notification = require(__base + 'services/utils/notification.js')
var mongoose = require(__base + 'services/database/database.js').mongoose

//------- Notifications keys ----------
var NOTIFICATION_TEXT = 'text'
var NOTIFICATION_OBJECT_ID = 'objectID'


module.exports.createQuestion = function(request,response) {
	var question = new Question({
		text : request.body.text,
		date : request.body.date,
		answered : false,
		sample : request.body.sample
	});

	question.save(function(err) {
		if (err){
			utils.httpResponse(response,500,err)
		}
		else{
			var hashmapMessage = new hashMap.HashMap()
			hashmapMessage.set(NOTIFICATION_TEXT,question.text)
			hashmapMessage.set(NOTIFICATION_OBJECT_ID,question._id)
			
			notification.sendNotification(hashmapMessage)
			utils.httpResponse(response,200,'Question successfully created')
		}
	});
}

module.exports.createValidation = function(request,response) {
	var validation = new Validation({
		date : request.body.date,
		answered : false,
		sample : request.body.sample
	});

	validation.save(function(err) {
		if (err){
			utils.httpResponse(response,500,err)
		}
		else{
			utils.httpResponse(response,200,'Validation successfully created')
		}
	});
}

module.exports.feedOverview = function(request,response) {
	Feed.find({answered : false}, '-__v')
			.populate('sample', 'specimenType environmentType results.possibleGerms results.finalGerm')
			.exec(function(err, questions){
				if (err){
					utils.httpResponse(response,404,err)
				}		
				else{
					utils.httpResponse(response,200,'Feeds successfully found',questions)
				}
			})
}

module.exports.questionOverview = function(request,response) {
	Question.find({answered : false}, '-__v')
			.populate('sample', 'specimenType environmentType')
			.exec(function(err, questions){
				if (err){
					utils.httpResponse(response,404,err)
				}		
				else{
					utils.httpResponse(response,200,'Questions successfully found',questions)
				}
			})
}

module.exports.validationOverview = function(request,response) {
	Validation.find({answered : false}, '-__v')
			.populate('sample', 'specimenType environmentType results.possibleGerms results.finalGerm')
			.exec(function(err, questions){
				if (err){
					utils.httpResponse(response,404,err)
				}		
				else{
					utils.httpResponse(response,200,'Questions successfully found',questions)
				}
			})
}

module.exports.questionHistory = function(request,response) {
	Question.find({answered : true}, '-__v')
			.populate('sample', 'specimenType environmentType')
			.exec(function(err, questions){
				if (err){
					utils.httpResponse(response,404,err)
				}		
				else{
					utils.httpResponse(response,200,'Questions successfully found',questions)
				}
			})
}

module.exports.specificQuestion = function(request,response) {
	Question.findById(mongoose.Types.ObjectId(request.query.questionId))
		.populate('sample')
		.exec(function(err, obj){
			if(err){
				utils.httpResponse(response,404,'Question not found')
			}
			else{
				obj.sample.populate('patient', function(err){
					if(err){
						utils.httpResponse(response,500,'Internal error')
					}else{
						utils.httpResponse(response,200,'Question successfully found',obj)
					}
				})
			}				
		})
}

module.exports.answerQuestion = function(request,response) {
	Question.findOne({_id: mongoose.Types.ObjectId(request.body.questionId)}, function (err, question) {
		if(err){
			utils.httpResponse(response,500,'Could not modify question')
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
				utils.httpResponse(response, 404, 'Question not found')
			}
		}		
	});
}


