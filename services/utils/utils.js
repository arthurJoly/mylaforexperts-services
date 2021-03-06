var User = require(__base + 'services/database/model.js').User


/**
* Return http response. Print message in console.
* @param response
* @param code Http status code
* @param description Description of the response
* @param ajaxCallback boolean that indicates if the services is call from jquery or not, default value is false
*/
function httpResponse(ajaxCallback, response,code,description,content) {
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
	
	response.writeHead(code, { 'Content-Type': 'application/json'});
	
	if(!ajaxCallback){
		if(content === undefined){
			response.write(JSON.stringify({description : description}))
		}else{
			response.write(JSON.stringify({description : description, content : content}))
		}			
	} else {
		if(content === undefined){
			response.write("callback(" + JSON.stringify({description : description}) + ")")
		}else{
			response.write("callback(" + JSON.stringify({description : description, content : content})+ ")")
		}
	}
		
	response.end()
}


/**
 * Restrict function. Check if the user is log in.
 * @param req
 * @param res
 * @param next
 */
function restrict(req, res, next) {
    if (req.session.userToken) {
        User.findOne({token : req.session.userToken}, function(err, obj) {
            if (obj) {
                next()
            }
            else {
                httpResponse(response,500,'Hike not found')
            }
        });
    } else {
        httpResponse(res,403,'Access denied !')
    }
}


module.exports.httpResponse = httpResponse
module.exports.restrict = restrict
