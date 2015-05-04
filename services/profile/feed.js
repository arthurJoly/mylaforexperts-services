var Feed = require(__base + 'services/database/model.js').Feed
var Question = require(__base + 'services/database/model.js').Question
var User = require(__base + 'services/database/model.js').User
var Validation = require(__base + 'services/database/model.js').Validation
var Sample = require(__base + 'services/database/model.js').Sample
var PetriDishSample = require(__base + 'services/database/model.js').PetriDishSample
var ValidationSample = require(__base + 'services/database/model.js').ValidationSample
var Patient= require(__base + 'services/database/model.js').Patient

var uuid = require('node-uuid')
var async = require('async')
var hashMap = require('hashmap')
var utils = require(__base + 'services/utils/utils.js')
var notification = require(__base + 'services/utils/notification.js')
var mongoose = require(__base + 'services/database/database.js').mongoose

//------- Notifications keys ----------
var NOTIFICATION_TEXT = 'text'
var NOTIFICATION_OBJECT_ID = 'objectID'
var NOTIFICATION_GERM_NAME = 'germName'
var NOTIFICATION_GERM_CONFIDENCE = 'germConfidence'
var NOTIFICATION_GERM_PATHOGEN_STATUS = 'germPathogenStatus'
var NOTIFICATION_COMMENT = 'comment'
var COLLAPSE_KEY_COMMENT = 'comment_key'
var COLLAPSE_KEY_QUESTION = 'question_key'
var COLLAPSE_KEY_VALIDATION = 'validation_key'


module.exports.createQuestion = function(request,response) {
	var question = new Question({
		text : request.body.text,
		answered : false,
		sample : request.body.sample
	});

	question.save(function(err) {
		if (err){
			utils.httpResponse(false, response,500,err)
		}
		else{
			var hashmapMessage = new hashMap.HashMap()
			hashmapMessage.set(NOTIFICATION_TEXT,question.text)
			hashmapMessage.set(NOTIFICATION_OBJECT_ID,question._id)
			
			notification.sendNotification(hashmapMessage, COLLAPSE_KEY_QUESTION)
			utils.httpResponse(false, response,200,'Question successfully created')
		}
	});
}

module.exports.createValidation = function(request,response) {
	var validation = new Validation({
		validateState : false,
		answered : false,
		sample : request.body.sample	
	});

	validation.save(function(err) {
		if (err){
			utils.httpResponse(false,response,500,err)
		}
		else{	
			Validation.findById(mongoose.Types.ObjectId(validation._id))
			.populate('sample')
			.exec(function(err, obj){
				if(!err){
					var hashmapMessage = new hashMap.HashMap()
					hashmapMessage.set(NOTIFICATION_GERM_NAME,obj.sample.result.finalGerm.name)
					hashmapMessage.set(NOTIFICATION_GERM_CONFIDENCE,obj.sample.result.finalGerm.confidence)
					hashmapMessage.set(NOTIFICATION_GERM_PATHOGEN_STATUS,obj.sample.result.finalGerm.pathogenStatus)
					hashmapMessage.set(NOTIFICATION_OBJECT_ID,obj._id)
					
					notification.sendNotification(hashmapMessage, COLLAPSE_KEY_VALIDATION)
					utils.httpResponse(false,response,200,'Validation successfully created')
				} else {
					utils.httpResponse(false,response,500,err)
				}
			})					
		}
	});
}

module.exports.feedOverview = function(request,response) {
	Feed.find({ $or:[{ $and:[{answered : false},{__t : "Question"}]}, { $and:[{$or:[{validateState : false},{answered : false}]},{__t : "Validation"}]} ]},'-__v -comments')
			.sort({date: 'ascending'})
			.populate('sample', 'specimenType environmentType result')
			.exec(function(err, questions){				
				if (err){
					utils.httpResponse(false,response,404,err)
				}		
				else{
					utils.httpResponse(false,response,200,'Feeds successfully found',questions)
				}								
			})
}

module.exports.questionOverview = function(request,response) {
	Question.find({answered : false}, '-__v -comments')
			.sort({date: 'ascending'})
			.populate('sample', 'specimenType environmentType')
			.exec(function(err, questions){
				if (err){
					utils.httpResponse(false,response,404,err)
				}		
				else{
					utils.httpResponse(false,response,200,'Questions successfully found',questions)
				}
			})
}

module.exports.validationOverview = function(request,response) {
	Validation.find({ $or:[{answered : false}, {validateState : false}] }, '-__v -comments')
			.sort({date: 'ascending'})
			.populate('sample', 'specimenType environmentType result')	
			.exec(function(err, questions){
				if (err){
					utils.httpResponse(false,response,404,err)
				}		
				else{
					utils.httpResponse(false,response,200,'Questions successfully found',questions)
				}
			})
}

module.exports.questionHistory = function(request,response) {
	Question.find({answered : true}, '-__v -comments')
			.sort({date: 'ascending'})
			.populate('sample', 'specimenType environmentType')
			.exec(function(err, questions){
				if (err){
					utils.httpResponse(false,response,404,err)
				}		
				else{
					utils.httpResponse(false,response,200,'Questions successfully found',questions)
				}
			})
}

module.exports.questionHistorySearch = function(request,response) {
	Question.find({answered : true}, '-__v -comments')
			.sort({date: 'ascending'})
			.populate('sample', 'specimenType environmentType patient')
			.populate('sample.patient')
			.exec(function(err, questions){
				if (err){
					utils.httpResponse(false,response,404,err)
				} else{	
					//Call asyn each in order to wait for the population to be complete before returning the questions to the client
					async.each(questions, function(aQuestion, callback){
						Sample.populate(aQuestion.sample, 'patient', function(err){
							callback();
						})
					}, function(err){
						function filterQuestionOnSample(question){
							return (typeof request.query.environmentType === 'undefined' && typeof request.query.specimenType === 'undefined') 
									|| (question.sample.specimenType == request.query.specimenType && typeof request.query.environmentType === 'undefined') 
									|| (question.sample.environmentType == request.query.environmentType && typeof request.query.specimenType === 'undefined') 
									|| (question.sample.environmentType == request.query.environmentType && question.sample.specimenType == request.query.specimenType && typeof request.query.environmentType !== 'undefined' && typeof request.query.specimenType !== 'undefined');
						}
						var questionsFilteredOnSample = questions.filter(filterQuestionOnSample);
						
						function filterQuestionOnPatient(question){
							return (typeof request.query.sex === 'undefined' && typeof request.query.age === 'undefined')
									|| (question.sample.patient.sex == request.query.sex && typeof request.query.age === 'undefined')
									|| (question.sample.patient.age == request.query.age && typeof request.query.sex === 'undefined')
									|| (question.sample.patient.age == request.query.age && question.sample.patient.sex == request.query.sex);
						}
						
						var questionsFiltered = questionsFilteredOnSample.filter(filterQuestionOnPatient);
						
						utils.httpResponse(false,response,200,'Questions successfully found',questionsFiltered)
					})
					
				}
			})
}

module.exports.specificQuestion = function(request,response) {
	Question.findById(mongoose.Types.ObjectId(request.query.questionId))
		.populate('sample')
		.populate('comments.user', '-password -token')
		.exec(function(err, obj){
			if(err){
				utils.httpResponse(false,response,404,'Question not found')
			}else{
				obj.sample.populate('patient', function(err){
					if(err){
						utils.httpResponse(false,response,500,'Internal error')
					}else{
						utils.httpResponse(false,response,200,'Question successfully found',obj)
					}
				})
			}				
		})
}

module.exports.specificValidation = function(request,response) {
	Validation.findById(mongoose.Types.ObjectId(request.query.validationId))
		.populate('sample')
		.populate('comments.user', '-password -token')	
		.exec(function(err, obj){
			if(err){
				utils.httpResponse(false,response,404,'Validation not found')
			}
			else{
				obj.sample.populate('patient', function(err){
					if(err){
						utils.httpResponse(false,response,500,'Internal error')
					}else{
						utils.httpResponse(false,response,200,'Validation successfully found',obj)
					}
				})
			}				
		})
}

module.exports.answerQuestion = function(request,response) {
	Question.findOne({_id: mongoose.Types.ObjectId(request.body.questionId)}, function (err, question) {
		if(err){
			utils.httpResponse(false,response,500,'Could not modify question')
		} else {
			if (question) {
				question.answered = true;
				
				PetriDishSample.findOne({_id : question.sample}, function(err, petridishSample){
					if(petridishSample){
						petridishSample.isolates = request.body.isolates;
						petridishSample.image.texts = request.body.texts;
						petridishSample.image.lines = request.body.lines;
						petridishSample.save();
					}
				})
							
				question.save();
				utils.httpResponse(false, response, 200, 'Question successfully modified')
			} else{
				utils.httpResponse( false, response, 404, 'Question not found')
			}
		}		
	});
}

module.exports.answerValidation = function(request,response) {
	Validation.findOne({_id: mongoose.Types.ObjectId(request.body.validationId)}, function (err, validation) {
		if(err){
			utils.httpResponse(false, response,500,'Could not modify validation')
		} else {
			if (validation) {
				User.findOne({token : request.session.userToken}, function(err,owner){
					if(!err){
						validation.answered = true;			
						validation.validateState = request.body.validateState;
						
						var currentDate = new Date();
						
						validation.comments.push({
							date : currentDate,
							user : owner._id,
							message : request.body.message	
						});
						validation.save();
						refreshComment(validation._id);	
						
						if(validation.validateState){
							validation.populate('sample', function(err){
								if(err){
									utils.httpResponse(false, response,500,'Internal error')
								}else{
									Patient.findById(validation.sample.patient,function(err, obj){
										obj.results.push({
											date : currentDate,
											name : validation.sample.result.finalGerm.name,
											pathogenStatus : validation.sample.result.finalGerm.pathogenStatus
										})
										obj.save();
									});
									utils.httpResponse(false, response,200,'Validation successfully answered',validation)
								}
							})
						}else{
							utils.httpResponse(false, response,200,'Validation successfully answered',validation)
						}																
					} else {
						utils.httpResponse(false, response,500,err)
					}
				});				
			} else{
				utils.httpResponse(false, response, 404, 'Validation not found')
			}
		}		
	});
}

module.exports.commentQuestion = function(request,response) {
	Question.findOne({_id: mongoose.Types.ObjectId(request.body.questionId)}, function (err, question) {
		if(err){
			utils.httpResponse(false, response,500,'Could not add comment')
		}else {
			if (question) {
				User.findOne({token : request.session.userToken}, function(err,owner){
					if(!err){		
						var commentDate = new Date();
					
						question.comments.push({
							date : commentDate,
							user : owner._id,
							message : request.body.message	
						});
						question.save();
						refreshComment(question._id);						
						utils.httpResponse(false, response,200,'Comment successfully added')
					} else {
						utils.httpResponse(false,response,500,err)
					}
				});				
			} else{
				utils.httpResponse(false, response, 404, 'Question not found')
			}
		}		
	});
}

module.exports.commentValidation = function(request,response) {
	Validation.findOne({_id: mongoose.Types.ObjectId(request.body.validationId)}, function (err, validation) {
		if(err){
			utils.httpResponse(false, response,500,'Could not add comment')
		} else {
			if (validation) {
				User.findOne({token : request.session.userToken}, function(err,owner){
					if(!err){		
						var commentDate = new Date();	
						
						validation.comments.push({
							date : commentDate,
							user : owner._id,
							message : request.body.message	
						});
						validation.save();
						refreshComment(validation._id);
						utils.httpResponse(false, response, 200, 'Comment successfully added')
					} else {
						utils.httpResponse(false, response,500,err)
					}
				});				
			} else{
				utils.httpResponse(false, response, 404, 'Validation not found')
			}
		}		
	});
}

module.exports.getQuestionComment = function(request,response) {
	Question.findById(mongoose.Types.ObjectId(request.query.questionId))
		.populate('comments.user', '-password -token')
		.exec(function(err, obj){
			if(err){
				utils.httpResponse(false, response,404,'Question not found')
			}else{
				utils.httpResponse(false, response,200,'Question comments successfully found',obj.comments)
			}				
		})
}

module.exports.getValidationComment = function(request,response) {
	Validation.findById(mongoose.Types.ObjectId(request.query.validationId))
		.populate('comments.user', '-password -token')
		.exec(function(err, obj){
			if(err){
				utils.httpResponse(false,response,404,'Validation not found')
			}else{
				utils.httpResponse(false,response,200,'Validation comments successfully found',obj.comments)			
			}				
		})
}

function refreshComment(id){
	var hashmapMessage = new hashMap.HashMap();
	hashmapMessage.set(NOTIFICATION_OBJECT_ID,id);
	hashmapMessage.set(NOTIFICATION_COMMENT,id);
	
	notification.sendNotification(hashmapMessage, COLLAPSE_KEY_COMMENT);
}


