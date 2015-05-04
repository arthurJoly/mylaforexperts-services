var Sample = require(__base + 'services/database/model.js').Sample
var PetriDishSample = require(__base + 'services/database/model.js').PetriDishSample
var Patient= require(__base + 'services/database/model.js').Patient

var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose

module.exports.createPatient = function(request,response) {
	var patient = new Patient({
			firstname : request.body.firstname,
			lastname : request.body.lastname,
			age : request.body.age,
			sex : request.body.sex,
			size : request.body.size,
			weight : request.body.weight
	});

	patient.save(function(err) {
		if (err)
			utils.httpResponse(false,response,500,err)
		else
			utils.httpResponse(false,response,200,'Patient successfully created')
	});
}

module.exports.patientOverview = function(request,response) {
	Patient.find({},'-__v -results',function(err, patients){
		if (err)
			utils.httpResponse(false,response,404,err)
		else
			utils.httpResponse(false,response,200,'Patients successfully found',patients)
	});
}

module.exports.specificPatient = function(request,response) {
	Patient.findById(mongoose.Types.ObjectId(request.query.patientId),function(err, obj){
		if (obj)
			utils.httpResponse(false,response,200,'Patient successfully found',obj)
		else
			utils.httpResponse(false,response,404,'Patient not found')
	});
}

module.exports.patientSearch = function(request,response) {
	if (typeof String.prototype.startsWith != 'function') {
		String.prototype.startsWith = function (str){
			return this.slice(0, str.length) == str;
		};
	}
	
	Patient.find({},'-__v -results',function(err, patients){
		if (err){
			utils.httpResponse(false,response,404,err)
		}else{
			function filterPatient(patient){
				return (patient.firstname.toLowerCase().startsWith(request.query.query.toLowerCase()) 
				|| patient.lastname.toLowerCase().startsWith(request.query.query.toLowerCase()) 
				|| patient.age.toString().toLowerCase().startsWith(request.query.query.toLowerCase())
				|| patient.size.toString().toLowerCase().startsWith(request.query.query.toLowerCase())
				|| patient.weight.toString().toLowerCase().startsWith(request.query.query.toLowerCase())
				|| patient._id.toString().toLowerCase().startsWith(request.query.query.toLowerCase()));				
			}
			var patientsFiltered = patients.filter(filterPatient);
			utils.httpResponse(false,response,200,'Patients successfully found',patientsFiltered)
		}
	});
}