/**
 * route file
 */

// dependeces
const { sampleHandler } = require('./handlers/routeHandalers/sampleHandler');
const { userHandler } = require('./handlers/routeHandalers/userHandler');

// safolding

const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;
