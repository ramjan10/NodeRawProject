//dependecies
const data  = require('../../lib/data');
const {parseJSON, createdRandomString} =  require('../../helpers/utilities');
const tokenHandler =  require('./tokenHandler');
const {maxChecks} = require('../../helpers/environments');

//scaffolding
const handler ={}

handler.checkHandler = (requestProperties, callback)=>{
    const  accptedMethods = ['get', 'post', 'put', 'delete'];
    if(accptedMethods.indexOf(requestProperties.method) > -1){
        handler._check[requestProperties.method](requestProperties, callback);
    }else{
        callback(405);
    }

}
handler._check = {};
handler._check.post = (requestProperties, callback)=>{
    const protocol = typeof(requestProperties.body.protocol) ==='string' && (['http', 'https'].indexOf(requestProperties.body.protocol) > -1) ? requestProperties.body.protocol: false; 
    const url = typeof(requestProperties.body.url) ==='string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url: false; 
    const method = typeof(requestProperties.body.method) ==='string' && ['GET','POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method: false; 
    const successCodes = typeof(requestProperties.body.successCodes) ==='object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;
    const timeOutSeconds =  typeof(requestProperties.body.timeOutSeconds) === 'number' && requestProperties.body.timeOutSeconds % 1 === 0 && requestProperties.body.timeOutSeconds >=1 && requestProperties.body.timeOutSeconds <= 5 ? requestProperties.body.timeOutSeconds : false;
    
    if(protocol && url && method && successCodes && timeOutSeconds){
        const token  = typeof(requestProperties.headerStringObject.token) === 'string' ? requestProperties.headerStringObject.token: false;
        data.read("tokens", token, (err1, tokenData)=>{
            if(!err1 && tokenData){
                const userPhone  = parseJSON(tokenData).phone;
                //get user info using phone
                data.read('users', userPhone, (err2, userData)=>{
                    if(!err2 && userData){
                        //token verify 
                        tokenHandler._token.verify(token, userPhone, (tokenIsValid)=>{
                            if(tokenIsValid){
                                let userObject = parseJSON(userData);
                                let userChecks = typeof(userObject.checks) ==='object' && userObject.checks instanceof Array ? userObject.checks : [];
                                if(userChecks.length <= maxChecks){
                                 const checkId =  createdRandomString(20);
                                 const checkObject = {
                                    'id': checkId,
                                    'userPhone': userPhone,
                                    protocol,
                                    url,
                                    method,
                                    successCodes,
                                    timeOutSeconds
                                 }
                                 //check create
                                 data.create('checks', checkId, checkObject, (err3)=>{
                                    if(!err3){
                                        userObject.checks = userChecks;
                                        userObject.checks.push(checkId);
                                        //user update  for checks add
                                        data.update('users', userPhone, userObject, (err4, checkData)=>{
                                            if(!err4){
                                                callback(200, checkObject);
                                            }else{
                                                callback(500, { 
                                                    error: 'there was a server problem'
                                                })
                                            }
                                        })
                                    }else{
                                        callback(500, { 
                                            error: 'there was a server problem'
                                        })
                                    }
                                 })

                                }else{
                                    callback(403, { 
                                        error: 'check can not more than ' + maxChecks
                                    })
                                }
                            }else{
                                callback(403, {
                                    error: 'there was a server error'
                                })
                            }
                        });
                    }else{
                        callback(403, {
                            error: err2,
                        })
                    }
                });
            }else{
                callback(403, {
                    error: 'Authentication faild'
                })
            }
        });
    }else{
        callback(400, {
            error: protocol + url + method + successCodes + timeOutSeconds
        })
    }

};
handler._check.get = (requestProperties, callback)=>{
    const id = typeof(requestProperties.queryStringObject.id) === 'string' && (requestProperties.queryStringObject.id).trim().length === 20 ? requestProperties.queryStringObject.id: false;
    if(id){ 
        data.read('checks', id, (err, checkData)=>{
            if(!err && checkData){
                const token  = typeof(requestProperties.headerStringObject.token) === 'string' ? requestProperties.headerStringObject.token: false;
                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenisValid)=>{
                    if(tokenisValid){    
                        callback(200, parseJSON(checkData));
                    }else{
                        callback(403, {
                            error: "Authentication field"
                        })
                    }
                })
            }else{
                callback(500, {
                    error: "there was server error"
                })
            }
        })
    }else{
        callback(400, {
            error: "there was request error"
        });
    }
};
handler._check.put = (requestProperties, callback)=>{
    const id = typeof(requestProperties.body.id) === 'string' && (requestProperties.body.id.length === 20) ? requestProperties.body.id: false;
    const protocol = typeof(requestProperties.body.protocol) ==='string' && (['http', 'https'].indexOf(requestProperties.body.protocol) > -1) ? requestProperties.body.protocol: false; 
    const url = typeof(requestProperties.body.url) ==='string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url: false; 
    const method = typeof(requestProperties.body.method) ==='string' && ['GET','POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method: false; 
    const successCodes = typeof(requestProperties.body.successCodes) ==='object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;
    const timeOutSeconds =  typeof(requestProperties.body.timeOutSeconds) === 'number' && requestProperties.body.timeOutSeconds % 1 === 0 && requestProperties.body.timeOutSeconds >=1 && requestProperties.body.timeOutSeconds <= 5 ? requestProperties.body.timeOutSeconds : false;

    if(id){
        if(protocol || url || method || successCodes || timeOutSeconds){
            data.read('checks', id, (err, checkData)=>{
                if(!err && checkData){
                    const checkObject = parseJSON(checkData);

                    const token  = typeof(requestProperties.headerStringObject.token) === 'string' ? requestProperties.headerStringObject.token: false;
                    tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid)=>{
                        if(tokenIsValid){
                            if(protocol){
                                checkObject.protocol =  protocol;
                            }
                            if(protocol){
                                checkObject.url =  url;
                            }
                            if(protocol){
                                checkObject.method =  method;
                            }
                            if(protocol){
                                checkObject.successCodes =  successCodes;
                            }
                            if(protocol){
                                checkObject.timeOutSeconds =  timeOutSeconds;
                            }
                            data.update('checks', id, checkObject, (err2)=>{
                                if(!err2){
                                    callback(200)
                                }else{
                                    callback(500, {
                                        error: 'there was a server error'
                                    })
                                }
                            })
                        }else{
                            callback(403, {
                                error: 'Authentication faild'
                            })
                        }
                    })
                }else{
                    callback(500, {
                        error: 'there was a server error'
                    })
                }
            })
        } callback(403, {
            error: protocol + url + method + successCodes + timeOutSeconds
        })
    }
};
handler._check.delete = (requestProperties, callback)=>{};

module.exports = handler;