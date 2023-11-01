/**
 * User handler
 */

// dependences
// scaffolding

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'this is user url',
    });
};

module.exports = handler;
