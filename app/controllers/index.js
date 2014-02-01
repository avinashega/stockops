
module.exports = {
		charge: function(req, res){
			res.render('charge');
		},
		
		charges: function(req, res){
			res.render('charges');
		},
		transfer: function(req, res){
			res.render('transfer');
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
				res.json({status:'Charge Created Successfully.'});
			}).fail(function(err){
				res.json({});
			});
		},
		
		getCharges: function(req, res){
			i.chargeService().getCharges().then(function(charges){
				res.json({});
			}).fail(function(err){
				res.json({});
			});
		},
		
		createTransfer: function(req, res){
			i.transferService().createTransfer(req).then(function(transfer){
				res.json({});
			}).fail(function(err){
				res.json({});
			});
		},
		
		getTransfers: function(req, res){
			i.transferService().getTransfers().then(function(transfers){
				res.json({});
			}).fail(function(err){
				res.json({});
			});
		},
		
		createRecipient: function(req, res){
			i.recipientService().createRecipient(req).then(function(recipient){
				res.json({});
			}).fail(function(err){
				res.json({});
			});
		},
		
		getRecipients: function(req, res){
			i.recipientService().getRecipients().then(function(recipients){
				res.json({});
			}).fail(function(err){
				res.json({});
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
			app.post('/charges/create', this.createCharge);
			app.get('/charges/list', this.getCharges);
			app.post('/transfers/create', this.createTransfer);
			app.get('/transfers/list', this.getTransfers);
			app.post('/recipients/create', this.createRecipient);
			app.get('/recipients/list', this.getRecipients);
		}
}