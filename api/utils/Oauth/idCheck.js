const addData = require('../../data/add.js');
const getData = require('../../data/get.js');

async function checkIfGoogleUserExists(userData) {
    const googleId = userData.sub;
    const email = userData.email;
    const name = userData.name;

    try {
        // Wrap the callback in a Promise
        const user = await new Promise((resolve, reject) => {
            getData.checkIfOAuthUserExists('google', googleId, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (user) {
            console.log('Google user exists:', user);
            return user;
        } else {
            console.log('Google user does not exist.');
        }

        // Add the user and return it
        const newUser = await new Promise((resolve, reject) => {
            addData.addGoogleUser(googleId, email, name, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        console.log('Google user added successfully:', newUser);
        return newUser;

    } catch (error) {
        console.error('Error checking/adding Google user:', error);
        throw error;
    }
}


async function checkIfGithubUserExists(userData) {
    const githubId = userData.id;
    const email = userData.email;
    const name = userData.login;

    try {
        // Check if the GitHub user already exists
        const user = await new Promise((resolve, reject) => {
            getData.checkIfOAuthUserExists('github', githubId, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (user) {
            console.log('GitHub user exists:', user);
            return user;
        } else {
            console.log('GitHub user does not exist. ID:', githubId);
        }

        // If not found, add the user
        const newUser = await new Promise((resolve, reject) => {
            addData.addGithubUser(githubId, email, name, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        console.log('GitHub user added successfully:', newUser);
        return newUser;

    } catch (error) {
        console.error('Error checking/adding GitHub user:', error);
        throw error;
    }
}


module.exports = { checkIfGoogleUserExists, checkIfGithubUserExists };