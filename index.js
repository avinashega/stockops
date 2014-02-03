var cluster = require('cluster'),
    cpuCount = 1,
    webWorkers = [];
var config = require('getconfig');

if (cluster.isMaster) {
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i++) {
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
        console.log('$$$ start http server: ' + cluster.worker.id);
        console.log('$$$ start http server at: ' + config.http.host + ':' + process.env.PORT || config.http.port);
        require('./app/web-http');
}

function addWebWorker() {
    webWorkers.push(cluster.fork({web: 1}).id);
}

function removeWebWorker(id) {
    webWorkers.splice(webWorkers.indexOf(id), 1);
}