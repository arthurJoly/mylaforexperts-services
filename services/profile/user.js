var User = require(__base + 'services/database/model.js').User
var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')

module.exports.registerUser = function(request,response) {
	var user = {
		username : request.body.username,
		password : request.body.password
	}
	
	User.find({username : user.username}, function(err, obj) {
		if (obj.length > 0) {
			utils.httpResponse(response,403,'User already exists')
		}
		else {
			var tmpUser = new User ({
				username : user.username,
				password : user.password
			});
			tmpUser.save(function (err) {
				if (err)
					utils.httpResponse(response,500,err)
				else
					utils.httpResponse(response,200,'User successfully created')
					//loginUser(tmpUser,request,response)
				
			});
		}		
	});
}

module.exports.loginUser = function(request,response) {
	var user = {
		username : request.body.username,
		password : request.body.password
	}
	loginUser(user,request,response)
}

function loginUser(user,request,response) {
	User.findOne({username : user.username}, function(err, obj) {
		if (obj) {
			utils.httpResponse(response,200,'User successfully (created and) logged in')
		}
		else {
			utils.httpResponse(response,500,'Impossible to log in the user, user not found')
		}
	});
}