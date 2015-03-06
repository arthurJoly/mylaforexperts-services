var Sample = require(__base + 'services/database/model.js').Sample
var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose


module.exports.createSample = function(request,response) {
	var sample = new Sample({
		specimenType : request.body.specimenType
	});

	sample.save(function(err) {
		if (err)
			utils.httpResponse(response,500,err)
		else
			utils.httpResponse(response,200,'Sample successfully created')
	});
}

module.exports.specificSample = function(request,response) {
	Sample.findById(mongoose.Types.ObjectId(request.query.sampleId), function(err, obj) {
	if (obj)
		utils.httpResponse(response,200,'Sample successfully found',obj)
	else
		utils.httpResponse(response,500,'Sample not found')
	});
}