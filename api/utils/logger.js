function log(message='no message provided', origin='Unknown') {
    const timestamp = new Date().toISOString();
    console.log(`# [${timestamp}] - [${origin}] - ${message}`);
}

function error(error, origin='Unknown') {
    const timestamp = new Date().toISOString();
    console.log(`#! [${timestamp}] - [${origin}] - ${error?.error?.message || error?.message || 'error occured'}`);
}

module.exports = {
    log,
    error
};