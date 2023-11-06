//dependecis
const https  = require('https');
const { twilio } = require('./environments');
const { stringify } = require('querystring');


//scafolding
const notifications = {};

notifications.sendTwilioSms = (phone, msg, callback)=>{
    const userPhone  = typeof('phone')==='string' && phone.trim().length === 11 ? phone : false;
    const userMsg  = typeof('msg')==='string' && msg.length > 0 &&  msg.length < 1500 ? msg : false;

    if(userPhone && userMsg){
        const payload = {
            From: twilio.fromPhone,
            To:`${userPhone}`,
            Body: userMsg,
        }
        const stringifyPayload = stringify(payload);

        //configuration
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }

        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the sent request
            const status = res.statusCode;
            // callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });

        req.write(stringifyPayload);
        req.end();
    }else {
        callback('Given parameters were missing or invalid!');
    }
}

module.exports = notifications;