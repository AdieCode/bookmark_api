function info(message='no message provided', origin='Unknown') {
    const timestamp = new Date().toISOString();
    console.log(`# [${timestamp}] - [${origin}] - ${message}`);
}

function error(error, origin='Unknown') {
    const timestamp = new Date().toISOString();
    console.log(`#ERROR! [${timestamp}] - [${origin}] - ${error?.error?.message || error?.message || JSON.stringify(error) || 'error occured'}`);
}

module.exports = {
    info,
    error
};