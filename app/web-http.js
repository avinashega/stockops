var express = require('express'),
    config = require('getconfig'),
    expressValidator = require('express-validator'),
    path = require('path'),
    app = express();

var port    = process.env.PORT || 8000;
var ipaddr = process.env.HOST || config.http.host;

app.configure('development', function () {
    app.use(express.logger('dev'));
});

app.configure(function () {

    //just touch it, to check mongodb connection
    console.log('mongodb');
    require('./bootstraps/mongoskin');
    console.log('mongo OK');

    app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
    console.log('A');
    app.use(express.static('public'));
    console.log('B');
    require('./bootstraps/handlebars')(app);
    console.log('1');
    app.use(express.favicon());
console.log('2');
    app.use(express.limit('5mb'));
    app.use(express.urlencoded({limit: '5mb'}));
    app.use(express.multipart({limit: '5mb'}));
    app.use(express.json({limit: '5mb'}));
console.log('3');
    app.use(express.cookieParser(config.http.cookieSecret));
    app.use(expressValidator());
console.log('4');
    app.use(express.methodOverride());
    app.use(function(req,resp,next){
        resp.setHeader('Strict-Transport-Security', 'max-age=8640000; includeSubDomains');
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return resp.redirect(301, 'https://' + req.headers.host + '/');
        }
        next();
    });
    console.log('start router');
    app.use(app.router);

    require('./bootstraps/controllers')(app);
});

app.listen(port,ipaddr);

module.exports = app;
