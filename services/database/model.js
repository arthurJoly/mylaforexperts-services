var mongoose = require(__base + 'services/database/database.js').mongoose;
var util = require('util');

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
});

//------ SAMPLE -------
//---------------------
function AbstractSampleSchema(){
	mongoose.Schema.apply(this, arguments);
	
	this.add({
		specimenType : Number
	});
};

util.inherits(AbstractSampleSchema, mongoose.Schema);

var sampleSchema = new AbstractSampleSchema(); 
	                                                  
//- PETRI DISH SAMPLE -
var petriDishSampleSchema = new AbstractSampleSchema({
	test : String
	/*isolates : [{
		type : mongoose.Schema.Types.ObjectId, ref : 'Isolate'
	}]*/
	
	//http://stackoverflow.com/questions/26825186/schemas-in-external-module-not-working-in-node-js
});

//----- ISOLATE ------
var isolateSchema = mongoose.Schema({
	color : Number,
	annotations : [{
		x : Number,
		y : Number,
		r : Number
	}]
});



/**
* Mongo model
*/

module.exports.User = mongoose.model('User', userSchema)
module.exports.Question = mongoose.model('Question', questionSchema)
module.exports.Sample = mongoose.model('Sample', sampleSchema)
module.exports.PetriDishSample = petriDishSampleSchema
module.exports.Isolate = mongoose.model('Isolate', isolateSchema)
