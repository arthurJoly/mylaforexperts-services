var Registration = require(__base + 'services/database/model.js').Registration
var gcm = require('node-gcm')
var mongoose = require(__base + 'services/database/database.js').mongoose

var NOTIFICATION_TEXT = 'text'
var NOTIFICATION_OBJECT_ID = 'objectID'

function sendNotification(textMessage, objectId){
	var message = new gcm.Message();
	
	message.addData(NOTIFICATION_TEXT, textMessage);
	message.addData(NOTIFICATION_OBJECT_ID, objectId);
	
	Registration.find({}, function(err, regids){
		var regidArray = ['APA91bFWeAuEPexPz_JNnFEy1wgOpMsFcY9Pm8CRC1QNkA9Qz3QK05N01vAXLvtCS6Ofub2K0xAJIoMIF3tAOf5vAfP40wK4sKik6oPViJcjKy3tL6QfDhPvi2tDujFPvjKiIsZEGTXxtd8PD8WhOi0h7CVnjpxGF_dADW1Vz17iFj88eiB8AyU'];
		/*regids.forEach(function(item){
			regidArray.push(item.regid);
		});*/
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