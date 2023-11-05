/**
 * environment set up
 */

// dependences

// scaffolding

const environments = {};

environments.staging = {
    port: 4000,
    envName: 'staging',
    secrateKey:'sdfsdfieuriwer',
    maxChecks: 5,
};
environments.production = {
    port: 5000,
    envName: 'production',
    secrateKey:'uryrueieudfhjd',
    maxChecks: 5,
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
