const BookmarkDB = require('./pool.js');
const { hashPassword } = require('../utils/auth.js');
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

    addUserReadableContent: async function(user_id, content_id, vol, chap, personal_score, content_status, callback) {
        try {
            // Insert the new user into the database
            await BookmarkDB.query('INSERT INTO user_readable_content (user_id, content_id, current_vol, current_chapter, personal_score, status) VALUES ($1, $2, $3, $4, $5, $6)', [user_id, content_id, vol, chap, personal_score, content_status]);

            // User added successfully
            callback(null, true);
        } catch (error) {
            console.error('Error adding user:', error);
            callback(error, false);
        }
    },

    addReadableContent: async function(anilist_content_id, title, description, cover_image_url, release_date, type, callback) {
        try {
            const date = new Date();
            // Insert the new user into the database
            await BookmarkDB.query('INSERT INTO readable_content (anilist_content_id, title, description, cover_image_url, release_date, type) VALUES ($1, $2, $3, $4, $5, $6)', [anilist_content_id, title, description, cover_image_url, release_date, type]);

            // User added successfully
            callback(null, true);
        } catch (error) {
            console.error('Error adding user:', error);
            callback(error, false);
        }
    },
}

module.exports = { addData };