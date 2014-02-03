module.exports = function (db) {

    db.bind('charges', {
    	updateCapture: function(charge, cb){
    		this.findAndModify({id: charge.id}, 
            		[
            		 ['_id', 'asc']
            	    ],                 
                    {$set: {captured:charge.captured}}, {new:true}, cb);
    	}

    });

};