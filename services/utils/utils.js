var Entities = require('ent')
var User = require(__base + 'services/database/model.js').User
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
		response.write(JSON.stringify({description : description,content : content}))
		
	response.end()
}


module.exports.httpResponse = httpResponse