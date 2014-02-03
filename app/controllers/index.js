var i= require('../i');
var jsonResp = i.jsonResponse;
var q = require('q');
var jsonResp = i.jsonResponse;

module.exports = {
		charge: function(req, res){
			res.render('charge');
		},
		
		charges: function(req, res){
			res.render('charges');
		},
		transfer: function(req, res){
			i.paymentService().getRecipients().then(function(data){
				res.render('transfer', {recipients:data});
			}).fail(function(err){
				res.render('transfer');
			}).done();
			
		},
		transfers: function(req, res){
			res.render('transfers');
		},
		recipient: function(req, res){
			res.render('recipient');
		},
		recipients: function(req, res){
			res.render('recipients');
		},
		
		createCharge: function(req, res){
			i.chargeService().createCharge(req).then(function(charge){
				res.json(jsonResp.data('Charge created successfully.'));
			}).fail(function(err){
				console.log(err);
				res.json(jsonResp.error(err));
			});
		},
		captureCharge:function(req, res){
			i.chargeService().captureCharge(req).then(function(charge){
				res.json(jsonResp.data('Charge captured successfully.'));
			}).fail(function(err){
				console.log(err);
				res.json(jsonResp.error(err));
			});
		},
		
		getCharges: function(req, res){
			i.chargeService().getCharges().then(function(charges){
				return q.nbind(res.render, res)('_chargeList', {charges: charges});
			})
            .then(function (html) {
                res.json(jsonResp.data(html));
            }).fail(function(err){
            	console.log(err);
                res.json(jsonResp.error(err));
			});
		},
		
		createTransfer: function(req, res){
			i.transferService().createTransfer(req).then(function(transfer){
				res.json(jsonResp.data('Transfer created successfully.'));
			}).fail(function(err){
				console.log(err);
                res.json(jsonResp.error(err));
			});
		},
		
		getTransfers: function(req, res){
			i.transferService().getTransfers().then(function(transfers){
				return q.nbind(res.render, res)('_transferList', {transfers: transfers});
			}).then(function (html) {
                res.json(jsonResp.data(html));
            }).fail(function(err){
            	console.log(err);
                res.json(jsonResp.error(err));
			});
		},
		
		createRecipient: function(req, res){
			i.recipientService().createRecipient(req).then(function(recipient){
				res.json(jsonResp.data('Recipient created successfully.'));
			}).fail(function(err){
				console.log(err);
                res.json(jsonResp.error(err));
			});
		},
		
		getRecipients: function(req, res){
			i.recipientService().getRecipients().then(function(recipients){
				return q.nbind(res.render, res)('_recipientList', {recipients: recipients});
			}).then(function (html) {
                res.json(jsonResp.data(html));
            }).fail(function(err){
            	console.log(err);
                res.json(jsonResp.error(err));
			});
		},
		
		routes: function(app){
			app.get('/', this.charge);
			app.get('/charge', this.charge);
			app.get('/charges', this.charges);
			app.get('/transfer', this.transfer);
			app.get('/transfers', this.transfers);
			app.get('/recipient', this.recipient);
			app.get('/recipients', this.recipients);
			app.post('/charges/add', this.createCharge);
			app.post('/charges/capture', this.captureCharge);
			app.get('/charges/list', this.getCharges);
			app.post('/transfers/add', this.createTransfer);
			app.get('/transfers/list', this.getTransfers);
			app.post('/recipients/add', this.createRecipient);
			app.get('/recipients/list', this.getRecipients);
		}
}