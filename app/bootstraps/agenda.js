var Agenda = require('agenda'),
    config = require('getconfig'),
    url = "mongodb://avinash:avinash@localhost:27017/stockops/?auto_reconnect=true",
    agenda = new Agenda({
        db: {
            address: url,
            collection: 'agendaJobs'
        },
        processEvery: '5 seconds'
    });

module.exports = agenda;