var User = require(__base + 'services/database/model.js').User
var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')




module.exports.getAll = function(request,response) {
	 User.find(function(err, users){
		utils.httpResponse(response,200,'users successfully found',users)
	});
}

/**
* Create a new user and log this user in
* @param request
* @param response
*/
module.exports.registerUser = function(request,response) {
	var user = {
		username : request.body.username
	}
	
	User.find({username : user.username}, function(err, obj) {
		if (obj.length > 0) {
			utils.httpResponse(response,403,'User already exists')
		}
		else {
			var tmpUser = new User ({
				username : user.username
			});
			tmpUser.save(function (err) {
				if (err)
					utils.httpResponse(response,500,err)
				else
					loginUser(tmpUser,request,response)
			});
		}		
	});
}

/**
* Log in the user and add its id into the session
* @param request
* @param response
*/
module.exports.loginUser = function(request,response) {
	var user = {
		username : request.body.username
	}
	loginUser(user,request,response)
}

/**
* Log in the user and ad d it into the session
* @param user User to log in
* @param request
* @param response
*/
function loginUser(user,request,response) {
	User.findOne({username : user.username}, function(err, obj) {
		if (obj) {
			obj.save()
			utils.httpResponse(response,200,'User successfully (created and) logged in')
		}
		else {
			utils.httpResponse(response,500,'Impossible to log in the user, user not found')
		}
	});
}