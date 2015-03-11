var Sample = require(__base + 'services/database/model.js').Sample
var PetriDishSample = require(__base + 'services/database/model.js').PetriDishSample
var Isolate = require(__base + 'services/database/model.js').Isolate
var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var mongoose = require(__base + 'services/database/database.js').mongoose


module.exports.createPetriDishSample = function(request,response) {
	//TODO : change how we get the isolates list
	//Isolate.find({}, function(err, isolateList){
		var petriDishSample = new PetriDishSample({
			specimenType : request.body.specimenType,
			//isolates : [isolateList[0]._id,isolateList[isolateList.length-1]._id]
			isolates : request.body.isolates
		});

		petriDishSample.save(function(err) {
			if (err)
				utils.httpResponse(response,500,err)
			else
				utils.httpResponse(response,200,'Sample successfully created')
		});
				
	//});
}

module.exports.specificPetriDishSample = function(request,response) {
	/*PetriDishSample.findById(mongoose.Types.ObjectId(request.query.sampleId))
			.populate('isolates')
			.exec(function(err, obj){
				if (obj)
					utils.httpResponse(response,200,'Sample successfully found',obj)
				else
					utils.httpResponse(response,500,'Sample not found')
			});*/
			
	PetriDishSample.findById(mongoose.Types.ObjectId(request.query.sampleId),function(err, obj){
		if (obj)
			utils.httpResponse(response,200,'Sample successfully found',obj)
		else
			utils.httpResponse(response,500,'Sample not found')
	});
}