var Validation = require(__base + 'services/database/model.js').Validation
var Sample = require(__base + 'services/database/model.js').Sample

var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose

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