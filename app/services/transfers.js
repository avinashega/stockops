var i= require('../i');
var q = require('q');
var transfers = i.db().transfers; 
module.exports = {
		getTransfers: function(){
			return q.nbind(transfers.findItems, transfers)({});
		},
		createTransfer: function(req){
			req.assert('recipient', 'Please select a Recipient').notEmpty();
	        return q.fcall(function () {
	            var errors = req.validationErrors();
	            if (errors) {
	                return q.reject(errors);
	            } else {
	                return req.body;
	            }
	        }).then(function (params) {
	        	return i.paymentService().createTransfer(params);
	        });
		}
}