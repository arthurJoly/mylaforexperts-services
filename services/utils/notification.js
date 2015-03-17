var gcm = require('node-gcm')
var Registration = require(__base + 'services/database/model.js').Registration


function sendNotification() {
	var message = new gcm.Message();
	message.addData('key1', 'test');
	Registration.find({}, function(err, regids){
		var sender = new gcm.Sender('AIzaSyDz1bKCtAVnRYzUebc8AO-35uyqv7Wpu48');
		sender.send(message, regIds, function (err, result) {
			if(err) 
				console.error(err);
			else    
				console.log(result);
		});
	});
}

module.exports.sendNotification = sendNotification