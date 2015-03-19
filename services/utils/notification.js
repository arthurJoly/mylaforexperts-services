var Registration = require(__base + 'services/database/model.js').Registration
var gcm = require('node-gcm')
var mongoose = require(__base + 'services/database/database.js').mongoose

var COLLAPSE_KEY_QUESTION = 'question_key'

var NOTIFICATION_TEXT = 'text'
var NOTIFICATION_OBJECT_ID = 'objectID'

function sendNotification(textMessage, objectId){
	var message = new gcm.Message();
	
	message.collapseKey = COLLAPSE_KEY_QUESTION 
	message.delayWhileIdle = false // do not wait for device to become active before sending.
	
	message.addData(NOTIFICATION_TEXT, textMessage);
	message.addData(NOTIFICATION_OBJECT_ID, objectId);
	
	Registration.find({}, function(err, regids){
		var regidArray = []
		regids.forEach(function(item){
			regidArray.push(item.regid);
		});
		var sender = new gcm.Sender('AIzaSyDz1bKCtAVnRYzUebc8AO-35uyqv7Wpu48');
		sender.send(message, regidArray, function (err, result) {
			if(err) 
				console.error(err);
			else    
				console.log(result);
		});
	});
}

module.exports.sendNotification = sendNotification