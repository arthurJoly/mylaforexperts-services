var Question = require(__base + 'services/database/model.js').Question
var Sample = require(__base + 'services/database/model.js').Sample
var PetriDishSample = require(__base + 'services/database/model.js').PetriDishSample
var Isolate = require(__base + 'services/database/model.js').Isolate

var uuid = require('node-uuid')
var deepPopulate = require('mongoose-deep-populate');
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose

module.exports.createQuestion = function(request,response) {
	PetriDishSample.find({}, function(err, petridishSamples){
		var question = new Question({
			text : request.body.text,
			date : request.body.date,
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
	 Question.find('-sample -__v',function(err, questions){
		if (err)
			utils.httpResponse(response,500,err)
		else
			utils.httpResponse(response,200,'Questions successfully found',questions)
	});
}

module.exports.specificQuestion = function(request,response) {
	/*Question.findById(mongoose.Types.ObjectId(request.query.questionId))
			.deepPopulate('sample.isolates')
			.exec(function(err, obj){
				if(err){
					utils.httpResponse(response,500,'Question not found')
				}
				else{
					utils.httpResponse(response,200,'Question successfully found',obj);
				}				
			})*/
	Question.findById(mongoose.Types.ObjectId(request.query.questionId))
			.lean()
			.populate('sample')
			.exec(function(err, obj){
				if(err){
					utils.httpResponse(response,500,'Question not found')
				}
				else{
					/*PetriDishSample.populate(obj, {
						path : 'sample.isolates',
						select : 'color',
						model : Isolate
					}, utils.httpResponse(response,200,'Question successfully found',obj));	*/
					PetriDishSample.populate(obj.isolates, {path : 'sample'}, function(err, obj){
						utils.httpResponse(response,200,'Question successfully found',obj);
					});
				}				
			})
}