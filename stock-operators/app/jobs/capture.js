var i = require('../i');
var config = require('getconfig');
var stripe = require("stripe")(config.stripe.secretKey);
var charges= i.db().charges;

module.exports = function (agenda) {
    agenda.define('capture', {concurrency: 10}, function (job, done) {
        var data = job.attrs.data;
        stripe.charges.capture(data.id, function(err, charge) {
        	  if(err){
        		  console.log('Capture Charge failed with error '+err.code + ' : ' + err.message);
        	  } else {
        		  charges.findAndModify({id: data.id}, [['_id', 'asc']], {$set: {paid:true}}, {new:true}, function(err, updated){
        		  });
        	  }
        	  done();
        });
    });
};