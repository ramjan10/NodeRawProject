/**
 * this is restApi for learning
 */

// dependences
const http = require('http');
const data = require('./lib/data');
const { handleRequest } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');

// create an scafolding opject
const app = {};

// data.create('test', 'newfile', { name: 'Ramjan', email: 'ramjan@gmail.com' }, (err) => {
//     console.log(err);
// });

// create server
app.createServer = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(environment.port, () => {
        console.log(`Listening prot  ${environment.port}`);
    });
};

// create handle request response
app.handleRequest = handleRequest;

app.createServer();
