var Entities = require('ent')
var User = require(__base + 'services/database/model.js').User
var gcm = require('node-gcm')


/**
* Return http response. Print message in console.
* @param response
* @param code Http status code
* @param description Description of the response
*/
function httpResponse(response,code,description,content) {
	var s
	
	if(/^1\d+/.test(code)) {
		s = '[INFORMATION] '
		log.info(s + description)
	} else if(/^2\d+/.test(code)) {
		s = '[SUCCESS] '
		log.info(s + description)
	} else if(/^3\d+/.test(code)) {
		s = '[REDIRECTION] '
		log.info(s + description)
	} else if(/^4\d+/.test(code)) {
		s = '[CLIENT ERROR] '
		log.error(s + description)
	} else if(/^5\d+/.test(code)) {
		s = '[SERVER ERROR] '
		log.error(s + description)
	}
	
	response.writeHead(code, { 'Content-Type': 'application/json' });
	
	if(content === undefined)
		response.write(JSON.stringify({description : description}))
	else
		response.write(JSON.stringify({description : description, content : content}))
		
	response.end()
}

function sendNotification(message){
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


module.exports.httpResponse = httpResponse
module.exports.sendNotification = sendNotification