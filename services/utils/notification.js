var Registration = require(__base + 'services/database/model.js').Registration
var gcm = require('node-gcm')
var hashMap = require('hashmap')
var mongoose = require(__base + 'services/database/database.js').mongoose

var COLLAPSE_KEY_QUESTION = 'question_key'
var TIME_TO_LIVE = 259200 // 3 days

function sendNotification(hashmapMessage){
	var message = new gcm.Message();
	
	message.collapseKey = COLLAPSE_KEY_QUESTION 
	message.delayWhileIdle = false // do not wait for device to become active before sending.
	message.timeToLive = TIME_TO_LIVE
	
	
	hashmapMessage.forEach(function(value, key){
		message.addData(key, value);
	})
		
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