var i= require('../i');
var transfers = i.db().transfers; 
module.exports = {
		gettransfers: function(){
			return q.nbind(transfers.find, transfers)({});
		}
}