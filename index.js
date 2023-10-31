/**
 * this is restApi for learning
 */

// dependences
const http = require('http');

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
app.handleRequest = (req, res) => {
    res.end('hellow programer ?? what time now');
};

app.createServer();
