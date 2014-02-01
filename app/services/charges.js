var i= require('../i');
var charges = i.db().charges; 
module.exports = {
		getCharges: function(){
			return q.nbind(charges.find, charges)({});
		}
}