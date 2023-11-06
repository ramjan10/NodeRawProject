/**
 * this is restApi for learning
 */

// dependences
const http = require('http');
const data = require('../lib/data');
const { handleRequest } = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');

// create an scafolding opject
const server = {};

// create server
server.createServer = () => {
    const createServerVariable  = http.createServer(server.handleRequest);
    createServerVariable.listen(environment.port, () => {
        console.log(`Listening prot  ${environment.port}`);
    });
};

// create handle request response
server.handleRequest = handleRequest;

server.init = () =>{
    server.createServer();
}

module.exports = server;

