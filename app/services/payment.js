var i = require('../i');
var q = require('q');
var config = require('getconfig');
var charges= i.db().charges;
var stripe = require("stripe")(config.stripe.secretKey);

module.exports = {
		createCharge: function(params){
			var amount = params.amount*100;//amount in cents needs to be passed to stripe.
			var capture = false;
			if(params.capture == 'capture'){
				capture = true;
			}
			var card = {};
			//card information
			card.number = params.cardNumber.replace(/ /g, '');
			card.exp_month = params.expiry.split('/')[0].trim();
			card.exp_year = params.expiry.split('/')[1].trim();
			card.cvc = params.cvc;
			//billing address
			card.name = params.name;
			card.address_line1 = params.addressLine1;
			card.address_line2 = params.addressLine2;
			card.address_city = params.city;
			card.address_zip = params.zip;
			card.address_state = params.state;
			card.address_country = params.country;
			var deferred = q.defer();
			stripe.charges.create({
				  amount: amount,
				  currency: config.stripe.currency,
				  card: card, // obtained with Stripe.js
				  capture: capture
				}, function(err, charge){
					if(err){
						deferred.reject('Create Charge failed with error ' + err.code + ' ' + err.message);
					} else{
						if(params.same == 'same'){
							console.log('same');
							charge.s_address_line1 = params.addressLine1;
							charge.s_address_line2 = params.addressLine2;
							charge.s_address_city = params.city;
							charge.s_address_zip = params.zip;
							charge.s_address_state = params.state;
							charge.s_address_country = params.country;	
						} else {
							console.log('different');
							charge.s_address_line1 = params.s_addressLine1;
							charge.s_address_line2 = params.s_addressLine2;
							charge.s_address_city = params.s_city;
							charge.s_address_zip = params.s_zip;
							charge.s_address_state = params.s_state;
							charge.s_address_country = params.s_country;
						}
						charge.product = params.product;
						charge.email = params.email;
						charge.phoneNumber = params.phoneNumber;
						charge.amount = params.amount;
						charge.name = params.name;
						charge.comment = params.comment;
						deferred.resolve(q.nbind(charges.save, charges)(charge));
					}
				});
			return deferred.promise;
		},
		
		captureCharge: function(id){
			console.log(id);
			var deferred = q.defer();
			stripe.charges.capture(id, function(err, charge){
					if(err){
						deferred.reject('Capture Charge failed with error ' + err.code + ' ' + err.message);
					} else{
						deferred.resolve(q.nbind(charges.updateCapture, charges)(charge));
					}
				});
			return deferred.promise;
		}
}