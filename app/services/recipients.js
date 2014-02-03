var i= require('../i');
var q = require('q');
var recipients = i.db().recipients; 
module.exports = {
		getRecipients: function(){
			var deferred = q.defer();
			return i.paymentService().getRecipients();
		},
		createRecipient: function(req){
	        req.assert('type', 'Please select a type').notEmpty();	        
	        return q.fcall(function () {
	            var errors = req.validationErrors();
	            if (errors) {
	                return q.reject(errors);
	            } else {
	                return req.body;
	            }
	        }).then(function (params) {
	        	return i.paymentService().createRecipient(params);
	        });
		}
}