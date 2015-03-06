var mongoose = require(__base + 'services/database/database.js').mongoose

/**
* MongoDB schema
*/
var userSchema = mongoose.Schema({
	username : String
})

var questionSchema = mongoose.Schema({
	text : String,
	date : String,
	sample : {type : mongoose.Schema.Types.ObjectId, ref : 'Sample'}
})

var sampleSchema = mongoose.Schema({
	specimenType : Number
})



/**
* Mongo model
*/
module.exports.User = mongoose.model('User', userSchema)
module.exports.Question = mongoose.model('Question', questionSchema)
module.exports.Sample = mongoose.model('Sample', sampleSchema)
