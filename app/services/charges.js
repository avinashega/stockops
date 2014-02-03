var i= require('../i');
var q = require('q');
var charges = i.db().charges; 
module.exports = {
		getCharges: function(){
			return q.nbind(charges.findItems, charges)({}).then(function(charges){
				console.log(charges);
				return charges;
			});
		},
		
		createCharge: function(req){
	        req.sanitize('email').trim();

	        req.assert('email', 'Valid email required').isEmail();
	        req.assert('product', 'Please select a product').notEmpty();
	        
	        return q.fcall(function () {
	            var errors = req.validationErrors();
	            if (errors) {
	                return q.reject(errors);
	            } else {
	                return req.body;
	            }
	        }).then(function (params) {
	        	return i.paymentService().createCharge(params);
	        });
		},
		
		captureCharge: function(req){
			return i.paymentService().captureCharge(req.body.id);
		}
}