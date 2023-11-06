/**
 * this is restApi for learning
 */

// dependences
const server  = require('./lib/server');
const worker = require('./lib/worker');

// create an scafolding opject
const app = {};

app.init = () => {
    //server 
    server.init();

    //worker
    worker.init();
}

app.init();

module.exports = app;

