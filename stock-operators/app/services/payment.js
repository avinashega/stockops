var i = require('../i');
var q = require('q');
var config = require('getconfig');
var charges= i.db().charges;
var recipients= i.db().recipients;
var transfers= i.db().transfers;
var agenda = i.agenda();
var stripe = require("stripe")(config.stripe.secretKey);

module.exports = {
		create: function(req){
			var amount = req.body.amount*100;//amount in cents needs to be passed to stripe.
			var deferred = q.defer();
			stripe.charges.create({
				  amount: amount,
				  currency: config.stripe.currency,
				  card: req.body.token, // obtained with Stripe.js
				  capture: req.body.capture
				}, function(err, charge){
					if(err){
						deferred.reject('Create Charge failed with error ' + err.code + ' ' + err.message);
					} else{
						deferred.resolve(q.nbind(charges.save, charges)(charge).then(function(charge){
							var job = agenda.create('capture', {id: charge.id});
	                        if (Date.now() < req.body.when) {
	                            job.attrs.nextRunAt = when;
	                        }
	                        q.nbind(job.save, job)();
						}));
					}
				});
			return deferred.promise;
		},
		
		createRecipient: function(req) {
			var deferred = q.defer();
			stripe.recipients.create({
				  name: req.body.name,
				  type: req.body.type, //"individual" or "corporation"
				  bank:{
					  country: "us",
					  routing_number: req.body.routing_number,
					  account_number: req.body.account_number
				  }				  
				}, function(err, recipient){
					if(err){
						deferred.reject('Create Recipient failed with error ' + err.code + ' ' + err.message);
					} else{
						deferred.resolve(q.nbind(recipients.save, recipients)(recipient));
					}
				});
			return deferred.promise;
		},
		
		createTransfer: function(req){
			var deferred = q.defer();
			stripe.transfers.create({
				  amount: req.body.amount*100, //amount in cents
				  currency: config.stripe.currency,
				  recipient: req.body.recipient,
				  description: req.body.description
				}, function(err, transfer) {
					if(err){
						deferred.reject('Create Transfer failed with error ' + err.code + ' ' + err.message);
					} else{
						deferred.resolve(q.nbind(transfers.save, transfers)(transfer));
					}
				});
			return deferred.promise;
		}
}