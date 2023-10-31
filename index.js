/**
 * this is restApi for learning
 */

// dependences
const http = require('http');
const {handleRequest} = require('./helpers/handleReqRes');

// create an scafolding opject
const app = {};

// all configuration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(app.config.port, () => {
        console.log(`Listening prot  ${app.config.port}`);
    });
};

// create handle request response
app.handleRequest = handleRequest

app.createServer();
