var Sample = require(__base + 'services/database/model.js').Sample
var PetriDishSample = require(__base + 'services/database/model.js').PetriDishSample
var Patient= require(__base + 'services/database/model.js').Patient

var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose

module.exports.createPatient = function(request,response) {
	var patient = new Patient({
			age : request.body.age,
			sex : request.body.sex,
			size : request.body.size,
			weight : request.body.weight,
			samples : request.body.samples
	});

	patient.save(function(err) {
		if (err)
			utils.httpResponse(response,500,err)
		else
			utils.httpResponse(response,200,'Patient successfully created')
	});
}

module.exports.specificPatient = function(request,response) {
	Patient.findById(mongoose.Types.ObjectId(request.query.patientId),function(err, obj){
		if (obj)
			utils.httpResponse(response,200,'Patient successfully found',obj)
		else
			utils.httpResponse(response,404,'Patient not found')
	});
}