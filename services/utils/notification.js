var gcm = require('node-gcm')

module.exports.sendNotification = function(message){
	var message = new gcm.Message();
	message.addData('key1', message);
	var regIds = ['APA91bFWeAuEPexPz_JNnFEy1wgOpMsFcY9Pm8CRC1QNkA9Qz3QK05N01vAXLvtCS6Ofub2K0xAJIoMIF3tAOf5vAfP40wK4sKik6oPViJcjKy3tL6QfDhPvi2tDujFPvjKiIsZEGTXxtd8PD8WhOi0h7CVnjpxGF_dADW1Vz17iFj88eiB8AyU'];
	var sender = new gcm.Sender('AIzaSyDz1bKCtAVnRYzUebc8AO-35uyqv7Wpu48');
	sender.send(message, regIds, function (err, result) {
		if(err) 
			console.error(err);
		else    
			console.log(result);
	});
}