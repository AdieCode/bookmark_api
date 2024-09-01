const { Pool } = require('pg');
const BookmarkDB = require('./pool.js');
const { hashPassword, checkPassword } = require('../utils/auth.js');
const getData = require('./get.js');


const addData = {
    addUser: async function(username, email, password, callback) {
        try {
            // Check if the username or email already exists
            const usernameExists = await getData.checkUsername(username);
            if (usernameExists) {
                callback('Username already exists', null);
                return;
            }

            // Check if the email or email already exists
            const emailExists = await getData.checkEmail(email);
            if (emailExists) {
                callback('Email already exists', null);
                return;
            }

            // Hash the password before storing it in the database
            const hashedPassword = await hashPassword(password);

            const date = new Date();
            // Insert the new user into the database
            await BookmarkDB.query('INSERT INTO users (username, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)', [username, email, hashedPassword, date]);

            // User added successfully
            callback(null, true);
        } catch (error) {
            console.error('Error adding user:', error);
            callback(error, false);
        }
    },
}

module.exports = { addData };