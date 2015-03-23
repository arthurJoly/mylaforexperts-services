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

//-------- FEED --------
//----------------------
function AbstractFeedSchema(){
	mongoose.Schema.apply(this, arguments);
	
	this.add({
		date : String,
		answered : Boolean,
		sample : {type : mongoose.Schema.Types.ObjectId, ref : 'Sample'}
	});
};

util.inherits(AbstractFeedSchema, mongoose.Schema);

var feedSchema = new AbstractFeedSchema(); 

//------ QUESTION ------
var questionSchema = new AbstractFeedSchema({
	text : String
});

//------ VALIDATION ------
var validationSchema = new AbstractFeedSchema({
});

//------ SAMPLE --------
//----------------------
function AbstractSampleSchema(){
	mongoose.Schema.apply(this, arguments);
	
	this.add({
		specimenType : Number,
		environmentType : Number,
		patient : {type : mongoose.Schema.Types.ObjectId, ref : 'Patient'},
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
	}], 
	image : {
		texts : [{
			x : Number,
			y : Number,
			text : String
		}],
		lines : [{
			x : Number,
			y : Number,		
			points : [{
				x : Number,
				y : Number
			}]
		}]
	}
});

//---- VALIDATION SAMPLE ---
var validationSampleSchema = new AbstractSampleSchema({
	result : {
		date : String,
		finalGerm : {
			name : String,
			confidence : Number,
			pathogenStatus : Number
		},
		possibleGerms : [{
			name : String,
			confidence : Number,
			pathogenStatus : Number
		}]
	}
});

//------ PATIENT -------
//----------------------
var patientSchema = mongoose.Schema({
	age : Number,
	sex : Number,
	size : Number,
	weight : Number,
	samples : [{type : mongoose.Schema.Types.ObjectId, ref : 'Sample'}]
});

//---- REGISTRATION ----
//----------------------
var registrationSchema = mongoose.Schema({
	regid : String
});


/**
* Mongo model
*/
module.exports.User = mongoose.model('User', userSchema)
var Feed = mongoose.model('Feed', feedSchema);
module.exports.Feed = Feed
module.exports.Question = Feed.discriminator('Question', questionSchema)
module.exports.Validation = Feed.discriminator('Validation', validationSchema)
var Sample = mongoose.model('Sample', sampleSchema);
module.exports.Sample = Sample
module.exports.PetriDishSample = Sample.discriminator('PetriDishSample', petriDishSampleSchema)
module.exports.ValidationSample = Sample.discriminator('ValidationSample', validationSampleSchema)
module.exports.Patient = mongoose.model('Patient', patientSchema)
module.exports.Registration = mongoose.model('Registration', registrationSchema)
