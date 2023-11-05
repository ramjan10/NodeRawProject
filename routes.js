/**
 * route file
 */

// dependeces
const { sampleHandler } = require('./handlers/routeHandalers/sampleHandler');
const { userHandler } = require('./handlers/routeHandalers/userHandler');
const {tokenHandler} = require('./handlers/routeHandalers/tokenHandler');
const {checkHandler} =  require('./handlers/routeHandalers/checkHandler');

// safolding

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token:tokenHandler,
    check:checkHandler,
};

module.exports = routes;
