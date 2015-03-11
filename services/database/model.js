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
	answered : Boolean,
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
	isolates : [{
		color : Number,
		annotations : [{
			x : Number,
			y : Number,
			r : Number
		}],
		tests : [{
			instrument : Number,
			detail : String	
		}]
	}]
});



/**
* Mongo model
*/
module.exports.User = mongoose.model('User', userSchema)
module.exports.Question = mongoose.model('Question', questionSchema)
var Sample = mongoose.model('Sample', sampleSchema);
module.exports.Sample = Sample
module.exports.PetriDishSample = Sample.discriminator('PetriDishSample', petriDishSampleSchema)
