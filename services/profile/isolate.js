var Isolate = require(__base + 'services/database/model.js').Isolate
var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose


module.exports.createIsolate = function(request,response) {
	var isolate = new Isolate({
		color : request.body.color,
		annotations : request.body.annotations,
		tests : request.body.tests
	});

	isolate.save(function(err) {
		if (err)
			utils.httpResponse(response,500,err)
		else
			utils.httpResponse(response,200,'Isolate successfully created')
	});
}

module.exports.specificIsolate = function(request,response) {
	Isolate.findById(mongoose.Types.ObjectId(request.query.isolateId), function(err, obj) {
	if (obj)
		utils.httpResponse(response,200,'Isolate successfully found',obj)
	else
		utils.httpResponse(response,500,'Isolate not found')
	});
}