/**
 * not found hadler
 */

//dependences


//sacafolding
const handler = {};

handler.notfoundHandler = (requestProperties, callback) =>{
    callback(404, {
        message: 'your requsted url not found !'
    })
}

module.exports = handler;
