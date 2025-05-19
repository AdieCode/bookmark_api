const BookmarkDB = require('./pool.js');
const { hashPassword } = require('../utils/Oauth/auth.js');
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

    addGoogleUser: async function(google_id, email, username, callback) {
        try {
            const insertSql = `
                INSERT INTO users (external_google_id, email, username, created_at, updated_at)
                VALUES ($1, $2, $3, NOW(), NOW())
                ON CONFLICT (email) DO NOTHING
                RETURNING *
            `;

            const result = await BookmarkDB.query(insertSql, [google_id, email, username]);

            if (result.rows.length > 0) {
                // Insert succeeded, return the new user
                callback(null, result.rows[0]);
            } else {
                // Insert was skipped due to conflict; fetch the existing user
                const selectSql = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
                const existing = await BookmarkDB.query(selectSql, [email]);

                if (existing.rows.length > 0) {
                    callback(null, existing.rows[0]);
                } else {
                    // This shouldn't happen, but handle just in case
                    callback(new Error('Google user insert failed and no existing user found'), null);
                }
            }
        } catch (error) {
            console.error('Error adding GitHub user:', error);
            callback(error, null);
        }
    },

    addGithubUser: async function(github_id, email, username, callback) {
        try {
            const insertSql = `
                INSERT INTO users (external_github_id, email, username, created_at, updated_at)
                VALUES ($1, $2, $3, NOW(), NOW())
                ON CONFLICT (email) DO NOTHING
                RETURNING *
            `;

            const result = await BookmarkDB.query(insertSql, [github_id, email || `${github_id}@github.com`, username]);

            if (result.rows.length > 0) {
                // Insert succeeded, return the new user
                callback(null, result.rows[0]);
            } else {
                // Insert was skipped due to conflict; fetch the existing user
                const selectSql = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
                const existing = await BookmarkDB.query(selectSql, [email]);

                if (existing.rows.length > 0) {
                    callback(null, existing.rows[0]);
                } else {
                    // This shouldn't happen, but handle just in case
                    callback(new Error('GitHub user insert failed and no existing user found'), null);
                }
            }
        } catch (error) {
            console.error('Error adding GitHub user:', error);
            callback(error, null);
        }
    },


    addUserReadableContent: async function(data, callback) {
    try {
        const { user_id, anilist_id } = data;

        // Step 1: Check if the content is already tracked
        const checkSql = `
            SELECT id FROM readable_tracked_content
            WHERE user_id = $1 AND anilist_id = $2 AND deleted IS NOT TRUE
        `;
        const checkResult = await BookmarkDB.query(checkSql, [user_id, anilist_id]);

        if (checkResult.rows.length > 0) {
            return callback(null, false);
        }

        // Filter out undefined or null values
        const entries = Object.entries(data).filter(([_, value]) => value !== undefined && value !== null);

        if (entries.length === 0) {
            return callback(new Error('No valid fields to insert'), false);
        }

        const columns = entries.map(([key]) => key);
        const placeholders = entries.map((_, index) => `$${index + 1}`);
        const values = entries.map(([_, value]) => value);

        const sql = `INSERT INTO readable_tracked_content (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

        await BookmarkDB.query(sql, values);

        callback(null, true);
    } catch (error) {
        console.error('Error adding user readable content:', error);
        callback(error, false);
    }
    },
    
    addUserWatchableContent: async function(data, callback) {
        try {
            const { user_id, anilist_id } = data;

            // Step 1: Check if the content is already tracked
            const checkSql = `
                SELECT id FROM watchable_tracked_content
                WHERE user_id = $1 AND anilist_id = $2 AND deleted IS NOT TRUE
            `;
            const checkResult = await BookmarkDB.query(checkSql, [user_id, anilist_id]);

            if (checkResult.rows.length > 0) {
                return callback(null, false);
            }

            // Filter out undefined or null values
            const entries = Object.entries(data).filter(([_, value]) => value !== undefined && value !== null);

            if (entries.length === 0) {
                return callback(new Error('No valid fields to insert'), false);
            }

            const columns = entries.map(([key]) => key);
            const placeholders = entries.map((_, index) => `$${index + 1}`);
            const values = entries.map(([_, value]) => value);

            const sql = `INSERT INTO watchable_tracked_content (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

            await BookmarkDB.query(sql, values);

            callback(null, true);
        } catch (error) {
            console.error('Error adding user watchable content:', error);
            callback(error, false);
        }
    },
}

module.exports = addData;