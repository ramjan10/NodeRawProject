/**
 * route file
 */

// dependeces
const { sampleHandler } = require('./handlers/routeHandalers/sampleHandler');
const { userHandler } = require('./handlers/routeHandalers/userHandler');
const {tokenHandler} = require('./handlers/routeHandalers/tokenHandler');

// safolding

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token:tokenHandler,
};

module.exports = routes;
