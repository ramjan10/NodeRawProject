/**
 * environment set up
 */

// dependences

// scaffolding

const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secrateKey:'sdfsdfieuriwer',
    maxChecks: 5,
    twilio:{
        fromPhone: '+15005550006',
        accountSid:'ACb32d411ad7fe886aac54c665d25e5c5d',
        authtoken:'9455e3eb3109edc12e3d8c92768f7a67'
    }
};
environments.production = {
    port: 5000,
    envName: 'production',
    secrateKey:'uryrueieudfhjd',
    maxChecks: 5,
    twilio:{
        fromPhone: '+15005550006',
        accountSid:'ACb32d411ad7fe886aac54c665d25e5c5d',
        authtoken:'9455e3eb3109edc12e3d8c92768f7a67'
    }
};

// determine which environment pass
const currentEnvironment = typeof (process.env.NODE_ENV === 'string')
    ? process.env.NODE_ENV
    : 'staging';

// export environment
const environmentExport = typeof (environments[currentEnvironment] === 'object')
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentExport;
