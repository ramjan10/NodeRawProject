/**
 * route file
 */



//dependeces
const {sampleHandler} = require('./handlers/routeHandalers/sampleHandler');

//safolding

const routes = {
    sample: sampleHandler,
}

module.exports = routes;