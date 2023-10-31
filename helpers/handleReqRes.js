/**
 * handle request and response
 * 
 */

//dependeces
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../routes');
const {notfoundHandler} = require('../handlers/routeHandalers/notFoundHandler');

//schafolding 
const handler = {};

//handler method
handler.handleRequest = (req, res) => {
    //get url
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimmedPath =  path.replace(/^\/+|\/$/g, '');
    const queryStringObject = parseUrl.query;
    const headerStringObject = req.headers;
    const method = req.method.toLowerCase();

    const requestProperties = {
        parseUrl,
        path,
        trimmedPath,
        queryStringObject,
        headerStringObject,
        method
    }

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notfoundHandler; 

    chosenHandler(requestProperties, (statusCode, payload)=>{
        statusCode = typeof(statusCode) === 'number' ? statusCode: 500;
        payload =  typeof(payload) === 'object' ? payload: {};

        const payloadString  = JSON.stringify(payload);
        res.writeHead(statusCode);
        res.end(payloadString);
    })
    
    const decoder = new StringDecoder('utf8');
    let realData = '';

    req.on('data', (buffer)=>{
        realData += decoder.write(buffer);
    });

    req.on('end', () =>{
        realData += decoder.end();
        console.log(realData);
        res.end('hellow programer');
    })
};

module.exports = handler;