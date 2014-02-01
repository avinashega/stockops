var i= require('../i');
var recipients = i.db().recipients; 
module.exports = {
		getrecipients: function(){
			return q.nbind(recipients.find, recipients)({});
		}
}