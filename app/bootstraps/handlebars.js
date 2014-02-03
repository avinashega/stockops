var hbs = require('express-hbs');
var tz = require('timezone');
module.exports = function (app) {
	
	/**
     * Date Format
     * Converts UNIX Epoch time to DD.MM.YY
     * 1343691442862 -> 31.07.12
     * Usage: {{dateFormat yourDate}}
     */
    hbs.handlebars.registerHelper('dateFormat', function(context) {
    	var date = new Date(context);
        return date;
    });

        app.engine('hbs', hbs.express3({
        partialsDir: __dirname + '/../partials/',
        layoutsDir: __dirname + '/../layouts/'
    }));
    app.set('views', __dirname + '/../views/');
    app.set('view engine', 'hbs');
};
