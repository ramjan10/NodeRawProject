/**
 * token route
 */

//dependecies
const data  =  require('../../lib/data');
const {hash} =  require('../../helpers/utilities');
const {parseJSON} =  require('../../helpers/utilities');
const {createdRandomString} =  require('../../helpers/utilities');

//scaffolding

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._token[requestProperties.method](requestProperties, callback);
    }else {
        callback(409);
    }
}

handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const phone = typeof(requestProperties.body.phone) === 'string' && (requestProperties.body.phone.trim().length === 11) ? requestProperties.body.phone: false;
    const password = typeof(requestProperties.body.password) === 'string' && (requestProperties.body.password.trim().length > 0) ? requestProperties.body.password: false;
    
    if(phone && password){
        data.read('users', phone, (err1, userData)=>{
            const hashedPassword = hash(password);

            if(hashedPassword === parseJSON(userData).password){
                const tokenId =  createdRandomString(20);
               const expires = Date.now() + (60*60*100);
               const tokenObject  = {
                phone,
                id: tokenId,
                expires,
               }
               data.create('tokens', tokenId, tokenObject, (err) => {
                    if(!err){
                        callback(200, tokenObject);
                    }else{
                        callback(502, {
                            error: "Error token not created"
                        })
                    }
               })
            }else{
                callback(501, {
                    error: "password not match"
                })
            }

        });
    }else{
        callback(400, {
            error: phone + password
        });
    }

};
handler._token.get = (requestProperties, callback) => {
    const id = typeof(requestProperties.queryStringObject.id) === 'string' && (requestProperties.queryStringObject.id.length === 20) ? requestProperties.queryStringObject.id: false;
    
    data.read('tokens', id, (err, tokenData)=>{
        const token = {...parseJSON(tokenData)};
        if(!err){
            callback(200, token);
        }else{
            callback(400, {
                error: 'there was a server error'
            });
        }
    });
};
handler._token.put = (requestProperties, callback) => {
    const id = typeof(requestProperties.body.id) === 'string' && (requestProperties.body.id.length === 20) ? requestProperties.body.id: false;
    const extend = typeof(requestProperties.body.extend) === 'boolean' && (requestProperties.body.extend === true) ? requestProperties.body.extend: false;
    
    if(id && extend){
        data.read('tokens', id, (err1, tokenData)=>{
            let token = {...parseJSON(tokenData)};
            if(!err1){
                if(token.expires >= Date.now()){
                    token.expires = Date.now() + (60 *60 *1000);
                    data.update('tokens', id, token, (err2)=>{
                        if(!err2){
                            callback(200, token);
                        }else{
                            callback(500, {
                                error: 'there was ar server error'
                            });
                        }
                    })
                }else{
                    callback(200, {
                        error: 'token has been expired'
                    });
                }
            }
        });
    }else{
        callback(400, {
            error: 'there was a request  error'
        });
    }
    


};
handler._token.delete = (requestProperties, callback) => {};

module.exports  = handler;