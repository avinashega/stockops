var i = require('../i');
var q = require('q');
var config = require('getconfig');
var charges= i.db().charges;
var recipients= i.db().recipients;
var transfers= i.db().transfers;
var agenda = i.agenda();
var stripe = require("stripe")(config.stripe.secretKey);

module.exports = {
		createCharge: function(params){
			var amount = parseInt(params.amount)*100;//amount in cents needs to be passed to stripe.
			var capture = false;
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
						charge.s_address_line1 = params.s_addressLine1;
						charge.s_address_line2 = params.s_addressLine2;
						charge.s_address_city = params.s_city;
						charge.s_address_zip = params.s_zip;
						charge.s_address_state = params.s_state;
						charge.s_address_country = params.s_country;
						charge.product = params.product;
						charge.email = params.email;
						charge.phoneNumber = params.phoneNumber;
						charge.amount = parseInt(params.amount);
						charge.name = params.name;
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
		},
		
		createRecipient: function(params) {
			var deferred = q.defer();
			stripe.recipients.create({
				  name: params.name,
				  type: params.type, //"individual" or "corporation"
				  bank_account:{
					  country: "US",
					  routing_number: params.routingNumber,
					  account_number: params.accountNumber
				  },
				  //tax_id: params.taxId,
				  email: params.email,
				  description: params.description
				}, function(err, recipient){
					if(err){
						deferred.reject('Create Recipient failed with error ' + err.code + ' ' + err.message);
					} else{
						deferred.resolve('Successfully created Recipient');
					}
				});
			return deferred.promise;
		},
		
		createTransfer: function(params){
			var deferred = q.defer();
			stripe.transfers.create({
				  amount: params.amount*100, //amount in cents
				  currency: config.stripe.currency,
				  recipient: params.recipient.split('#and#')[0].trim(),
				  description: params.description
				}, function(err, transfer) {
					if(err){
						deferred.reject('Create Transfer failed with error ' + err.code + ' ' + err.message);
					} else{
						transfer.name = params.recipient.split('#and#')[1].trim()
						deferred.resolve(q.nbind(transfers.save, transfers)(transfer));
					}
				});
			return deferred.promise;
		},
		
		getRecipients: function(){
			var deferred = q.defer();
			stripe.recipients.list(function(err, recipients) {
				if(err){
					deferred.reject('Get recipients failed with error ' + err.code + ' ' + err.message);
				} else {
				  deferred.resolve(recipients.data);
				}
			});
			return deferred.promise;
		}
}