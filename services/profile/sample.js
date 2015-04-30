var Sample = require(__base + 'services/database/model.js').Sample
var PetriDishSample = require(__base + 'services/database/model.js').PetriDishSample
var ValidationSample = require(__base + 'services/database/model.js').ValidationSample
var Patient = require(__base + 'services/database/model.js').Patient

var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose


module.exports.createPetriDishSample = function(request,response) {
	var petriDishSample = new PetriDishSample({
		specimenType : request.body.specimenType,
		environmentType : request.body.environmentType,
		isolates : request.body.isolates,
		image : request.body.image,
		patient : request.body.patient
	});

	petriDishSample.save(function(err) {
		if (err)
			utils.httpResponse(response,500,err)
		else
			utils.httpResponse(response,200,'Sample successfully created')
	});
}

module.exports.createValidationSample = function(request,response) {
	var validationSample = new ValidationSample({
		specimenType : request.body.specimenType,
		environmentType : request.body.environmentType,
		result : request.body.result,
		patient : request.body.patient
	});

	validationSample.save(function(err) {
		if (err)
			utils.httpResponse(response,500,err)
		else
			utils.httpResponse(response,200,'Sample successfully created')
	});
}

module.exports.sampleOverview = function(request,response) {
	 Sample.find({},'-isolates -image -result -patient -__v',function(err, samples){
		if (err)
			utils.httpResponse(response,404,err)
		else
			utils.httpResponse(response,200,'Samples successfully found',samples)
	});
}

module.exports.specificPetriDishSample = function(request,response) {
	PetriDishSample.findById(mongoose.Types.ObjectId(request.query.sampleId))
		.populate('patient')
		.exec(function(err,obj){
			if (obj)
				utils.httpResponse(response,200,'Sample successfully found',obj)
			else
				utils.httpResponse(response,404,'Sample not found')
		});
}

module.exports.specificValidationSample = function(request,response) {
	ValidationSample.findById(mongoose.Types.ObjectId(request.query.sampleId))
		.populate('patient')
		.exec(function(err,obj){
			if (obj)
				utils.httpResponse(response,200,'Sample successfully found',obj)
			else
				utils.httpResponse(response,404,'Sample not found')
		});
}

module.exports.sampleSearch = function(request,response) {	
	if (typeof String.prototype.startsWith != 'function') {
		String.prototype.startsWith = function (str){
			return this.slice(0, str.length) == str;
		};
	}

	Sample.find({},'-__v -patient',function(err, samples){
		if (err){
			utils.httpResponse(response,404,err)
		}else{
			function filterSample(sample){
				return (sample.specimenType == request.query.specimenType
				|| sample.environmentType == request.query.environmentType
				|| sample._id.toString().toLowerCase().startsWith(request.query.query.toLowerCase()));				
			}
			var samplesFiltered = samples.filter(filterSample);
			utils.httpResponse(response,200,'Samples successfully found',samplesFiltered)
		}
	});
}