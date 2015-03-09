var mongoose = require(__base + 'services/database/database.js').mongoose
var extend = require('mongoose-schema-extend');

/**
* MongoDB schema
*/
//-------- USER --------
//----------------------
var userSchema = mongoose.Schema({
	username : String
})

//------ QUESTION ------
//----------------------
var questionSchema = mongoose.Schema({
	text : String,
	date : String,
	sample : {type : mongoose.Schema.Types.ObjectId, ref : 'Sample'}
})

//------ SAMPLE -------
//---------------------
var sampleSchema = mongoose.Schema({
	specimenType : Number
}, { collection : 'samples', discriminatorKey : '_type' })

//- PETRI DISH SAMPLE -
var petriDishSampleSchema = sampleSchema.extend({
	isolates : [{
		type : mongoose.Schema.Types.ObjectId, ref : 'Isolate'
	}]
})

//----- ISOLATE ------
var isolateSchema = mongoose.Schema({
	color : Number,
	annotations : [{
		x : Number,
		y : Number,
		r : Number
	}]
})



/**
* Mongo model
*/
module.exports.User = mongoose.model('User', userSchema)
module.exports.Question = mongoose.model('Question', questionSchema)
module.exports.Sample = mongoose.model('Sample', sampleSchema)
module.exports.PetriDishSample = mongoose.model('PetriDishSample', petriDishSampleSchema)
module.exports.Isolate = mongoose.model('Isolate', isolateSchema)
