var Registration = require(__base + 'services/database/model.js').Registration

var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose


module.exports.createRegistration = function(request,response) {
	var registration = new Registration({
			regid : request.body.regid,
	});

	registration.save(function(err) {
		if (err)
			utils.httpResponse(false,response,500,err)
		else
			utils.httpResponse(false,response,200,'Registration successfully created')
	});
}