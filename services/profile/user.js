var User = require(__base + 'services/database/model.js').User
var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')

module.exports.registerUser = function(request,response) {
	var user = {
		username : request.body.username,
		password : request.body.password,
		role : request.body.role
	}
	
	User.find({username : user.username}, function(err, obj) {
		if (obj.length > 0) {
			utils.httpResponse(false,response,403,'User already exists')
		}else {
			var tmpUser = new User ({
				username : user.username,
				password : user.password,
				role : user.role
			});
			tmpUser.save(function (err) {
				if (err)
					utils.httpResponse(false,response,500,err)
				else
					loginUser(tmpUser,request,response)
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
	User.findOne({username : user.username, password : user.password}, function(err, obj) {
		if (obj) {
			obj.token = uuid.v4()
			request.session.userToken = obj.token;
			obj.save()
			utils.httpResponse(false,response,200,'User successfully (created and) logged in')
		}else {
			utils.httpResponse(false,response,500,'Impossible to log in the user, user not found')
		}
	});
}

module.exports.openSession = function(request,response) {
	User.findOne({username : request.body.username}, function(err, obj) {
		if (obj) {
			obj.token = uuid.v4()
			request.session.userToken = obj.token;
			obj.save()
			utils.httpResponse(false,response,200,'New session opened')
		}else {
			utils.httpResponse(false,response,500,'Impossible to open a new session for this user')
		}
	});
}

module.exports.logoutUser = function(request,response) {
    request.session.destroy(function(){
        utils.httpResponse(false,response,200,'Successfully logout')
    });
}
