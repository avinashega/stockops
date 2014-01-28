
module.exports = {
		index: function(req, res){
			
		},
		createCharge: function(req, res){
			i.paymentService().createCharge(req).then(function(charge){
				res.json({});
			}).fail(function(err){
				res.json({});
			});
		},
		
		routes: function(app){
			app.get('/', this.index);
			app.post('/create', this.createCharge);
		}
}