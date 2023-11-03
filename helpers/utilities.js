/**
 * Utility tools
 */

// dependecies
const cripto  = require('crypto');
const environments = require('../helpers/environments');

// sacffoding
const utilities = {};

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }

    return output;
};

utilities.hash = (str)=>{
    if(typeof(str)==='string' &&    str.length > 0){
        let hash = cripto.createHmac("sha256", environments.secrateKey).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
}

utilities.createdRandomString = (strLength) =>{
    let length = strLength;
    length = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;
    if(length){
        const possibleCharacter = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for(let i=1; i <= length; i +=1){
            const randomCharecter = possibleCharacter.charAt(Math.floor(Math.random() * possibleCharacter.length));
            output += randomCharecter;
        }
        return output;  
    }
    return false;
    
}

module.exports = utilities;
