#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var cluster = require('cluster'),
    cpuCount = 1,
    webWorkers = [];
var config = require('getconfig');

var SchedugramSrv = function() {
    var self=this;
    self.setupVariables = function() {
        self.ipaddress = config.http.host;
        self.port      = config.http.port;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using ' + process.env.PORT);
            self.ipaddress = process.env.IP;
            self.port = process.env.PORT;
        };
    };
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };

    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };
    
    self.initializeServer = function() {
        // Server info
        if (cluster.isMaster) {

        // Create a worker for each CPU
        for (var i = 0; i < cpuCount; i += 1) {
            addWebWorker();
        }
    
        cluster.on('exit', function (worker, code, signal) {
    
            if (webWorkers.indexOf(worker.id) != -1) {
                console.log('$$$ http worker ' + worker.process.pid + ' died. Trying to respawn...');
                removeWebWorker();
                addWebWorker();
            }
        });
    
        } else {
            if (process.env.web) {
                console.log('$$$ start http server: ' + cluster.worker.id);
                console.log('$$$ start http server at: ' + config.http.host + ':' + config.http.port);
                require('./app/web-http');
            }
        
        }
        
        function addWebWorker() {
            webWorkers.push(cluster.fork({web: 1}).id);
        }
        
        
        function removeWebWorker(id) {
            webWorkers.splice(webWorkers.indexOf(id), 1);
        }
        
    };
    self.initialize = function() {
        self.setupVariables();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };
};

/**
 *  main():  Main code.
 */
console.log('starting up....');
var zapp = new SchedugramSrv();
zapp.initialize();
// zapp.start();
