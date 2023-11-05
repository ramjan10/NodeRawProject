/**
 * User handler
 */

// dependences
const data  = require('../../lib/data');
const {hash} = require("../../helpers/utilities");
const { has } = require('lodash');
const {parseJSON} = require('../../helpers/utilities');
const tokenHandler =  require('./tokenHandler');

// scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName = typeof(requestProperties.body.firstName) === 'string' && (requestProperties.body.firstName.trim().length > 0) ? requestProperties.body.firstName : false;
    const lastName = typeof(requestProperties.body.lastName) === 'string' && (requestProperties.body.lastName.trim().length > 0) ? requestProperties.body.lastName: false;
    const phone = typeof(requestProperties.body.phone) === 'string' && (requestProperties.body.phone.trim().length === 11) ? requestProperties.body.phone: false;
    const password = typeof(requestProperties.body.password) === 'string' && (requestProperties.body.password.trim().length > 0) ? requestProperties.body.password: false;
    const toAgreement = typeof(requestProperties.body.toAgreement) === 'boolean' ? requestProperties.body.toAgreement: false;

    if(firstName && lastName && phone && password && toAgreement){
        data.read('users', phone, (err1)=>{
            if(err1){
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    toAgreement
                }

                data.create("users", phone, userObject, (err2) => {
                    if(!err2){
                        callback(200, {
                            message: "user created successfully !."
                        })
                    }else{
                        callback(500, {
                            error: "could not create user"
                        });
                    }
                })
            }else{
                callback(500, {
                    error: "there was a error on server side"
                })
            }
        })
    }else{
        callback(500, {
            error: firstName + lastName + phone + password + toAgreement
        })
    }
};

handler._users.get = (requestProperties, callback) => {
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && (requestProperties.queryStringObject.phone).trim().length > 0 ? requestProperties.queryStringObject.phone: false;
    if(phone){
        const token = typeof(requestProperties.headerStringObject.token) === 'string' ? requestProperties.headerStringObject.token: false;
        tokenHandler._token.verify(token, phone, (tokenId)=>{
            if(tokenId){
                data.read('users', phone, (err, u) =>{
                    const user = {...parseJSON(u)};
                    if(!err && u){
                        delete(user.password);
                        callback(200, user);
                    }else{
                        callback(404, {
                            error: "Requested user not found",
                        });
                    }
                });
            }else{
                callback(504, {
                    error: "Authentication  failed",
                });
            }
        }); 
    }else{
        callback(404, {
            error: "Requested user not found",
        });
    }
};

handler._users.put = (requestProperties, callback) => {
    const firstName = typeof(requestProperties.body.firstName) === 'string' && (requestProperties.body.firstName.trim().length > 0) ? requestProperties.body.firstName : false;
    const lastName = typeof(requestProperties.body.lastName) === 'string' && (requestProperties.body.lastName.trim().length > 0) ? requestProperties.body.lastName: false;
    const phone = typeof(requestProperties.body.phone) === 'string' && (requestProperties.body.phone.trim().length === 11) ? requestProperties.body.phone: false;
    const password = typeof(requestProperties.body.password) === 'string' && (requestProperties.body.password.trim().length > 0) ? requestProperties.body.password: false;
   
    if(phone){
        const token = typeof(requestProperties.headerStringObject.token) === 'string' ? requestProperties.headerStringObject.token: false;
        
        tokenHandler._token.verify(token, phone, (tokenId)=>{
            if(tokenId){
                data.read('users', phone, (err1, uData) => {
                    if(!err1 && uData){
                        const UserData = {... parseJSON(uData)};
                        
                        if(firstName || lastName || password){
                            if(firstName){
                                UserData.firstName = firstName;
                            }
                            if(lastName){
                                UserData.lastName = lastName;
                            }
                            if(password){
                                UserData.password = hash(password);
                            }
                            
                            data.update('users', phone, UserData, (err2) => {
                                if(!err2){
                                    callback(200, {
                                        message: "user updated successfully !."
                                    })
                                }else{
                                    callback(500, {
                                        error: err2,
                                    })
                                }
                            });
        
                        }else{
                            callback(500, {
                                error: "there was a error on server side"
                            })
                        }
        
                    }else{
                        callback(402, {
                            error: "Requested user not found",
                        });
                    }
                });
            }else{
                callback(504, {
                    error: "Authentication  failed",
                });
            }
        });
    }else{
        callback(401, {
            error: "Requested user not found",
        });
    };
};

handler._users.delete = (requestProperties, callback) => {
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && (requestProperties.queryStringObject.phone).trim().length > 0 ? requestProperties.queryStringObject.phone: false;
    if(phone){
        
        const token = typeof(requestProperties.headerStringObject.token) === 'string' ? requestProperties.headerStringObject.token: false;
        tokenHandler._token.verify(token, phone, (tokenId)=>{
            if(tokenId){
                data.delete('users', phone, (err) => {
                    if(!err){
                        callback(200, {
                            message:'file deleted successfull'
                        });
                    }else{
                        callback(500, {
                            error: "there was a error on server side"
                        })
                    }
                });
            }else{
                callback(403, {
                    error:"Authentication field"
                })
            }
        })
    }else{
        callback(404, {
            error: "Requested user not found",
        });
    };
    
};

module.exports = handler;
