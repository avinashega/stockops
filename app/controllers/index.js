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
		
		routes: function(app){
			app.get('/', this.charge);
			app.get('/charge', this.charge);
			app.get('/charges', this.charges);
			app.post('/charges/add', this.createCharge);
			app.post('/charges/capture', this.captureCharge);
			app.get('/charges/list', this.getCharges);
		}
}