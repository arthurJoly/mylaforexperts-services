var mongoose = require(__base + 'services/database/database.js').mongoose

/**
* MongoDB schema
*/
var userSchema = mongoose.Schema({
	username : String
})


/**
* Mongo model
*/
module.exports.User = mongoose.model('User', userSchema)

