const BookmarkDB = require('./pool.js');
const { checkPassword } = require('../utils/Oauth/auth.js');


const getData = {
    // checks if username already exists
    checkUsername: async function(username) {
        try {
            const result = await BookmarkDB.query('SELECT * FROM users WHERE username = $1', [username]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error checking username:', error);
            return false;
        }
    },

    // checks if email already exists
    checkEmail: async function(email) {
        try {
            const result = await BookmarkDB.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    },

    checkLogin : function(email, password, callback) {
        BookmarkDB.query('SELECT * FROM users WHERE email = $1', [email], async (err, res) => {
            if (err) {
                console.error('Error checking login credentials:', err);
                callback(err, false);
                return;
            }
            
            if (res.rows.length > 0) {
                const isValidPassword = await checkPassword(password, res.rows[0].password);
                if (isValidPassword){
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            } else {
                callback(null, false);
            }
        });
    },

    checkIfOAuthUserExists: async function(provider, externalId, callback) {
        try {
            let column;
            if (provider === 'google') {
                column = 'external_google_id';
            } else if (provider === 'github') {
                column = 'external_github_id';
            } else {
                return callback(new Error('Invalid provider specified'), null);
            }

            const sql = `SELECT * FROM users WHERE ${column} = $1 LIMIT 1`;
            const result = await BookmarkDB.query(sql, [externalId]);

            if (result.rows.length > 0) {
                callback(null, result.rows[0]); // User exists
            } else {
                callback(null, null); // User does not exist
            }
        } catch (error) {
            console.error('Error checking OAuth user:', error);
            callback(error, null);
        }
    },

    getAllUserReadableContent: async function(user_id, callback) {
        try {
            const result = await BookmarkDB.query(
                'SELECT * FROM readable_tracked_content WHERE user_id = $1',
                [user_id]
            );
    
            if (result.rows.length > 0) {
                callback(null, result.rows);
            } else {
                callback(null, []);
            }
        } catch (error) {
            console.error('Error retrieving readable content:', error);
            callback(error, false);
        }
    },

    getUserReadableContent: async function(user_id, status, callback) {
        try {
            const result = await BookmarkDB.query(
                'SELECT * FROM readable_tracked_content WHERE user_id = $1 AND status = $2',
                [user_id, status]
            );
    
            if (result.rows.length > 0) {
                callback(null, result.rows);
            } else {
                callback('No content found for this user ID and status', null);
            }
        } catch (error) {
            console.error('Error retrieving readable content:', error);
            callback(error, false);
        }
    },
    
    getUserWatchableContent: async function(user_id, callback) {
        try {
            const result = await BookmarkDB.query(
                'SELECT user_id, content_id, current_season, current_episode, personal_score, status FROM user_watchable_content WHERE user_id = $1',
                [user_id]
            );
    
            if (result.rows.length > 0) {
                callback(null, result.rows);
            } else {
                callback('No content found for this user ID', null);
            }
        } catch (error) {
            console.error('Error retrieving readable content:', error);
            callback(error, false);
        }
    },  
    
    getReadableContent: async function(content_id, callback) {
        try {
            const result = await BookmarkDB.query(
                'SELECT user_id, content_id, current_vol, current_chapter, personal_score, status FROM user_readable_content WHERE content_id = $1',
                [content_id]
            );
    
            if (result.rows.length > 0) {
                callback(null, result.rows);
            } else {
                callback('No content found for this content ID', null);
            }
        } catch (error) {
            console.error('Error retrieving readable content:', error);
            callback(error, false);
        }
    },
    
    getWatchableContent: async function(content_id, callback) {
        try {
            const result = await BookmarkDB.query(
                'SELECT user_id, content_id, current_season, current_episode, personal_score, status FROM user_watchable_content WHERE content_id = $1',
                [content_id]
            );
    
            if (result.rows.length > 0) {
                callback(null, result.rows);
            } else {
                callback('No content found for this content ID', null);
            }
        } catch (error) {
            console.error('Error retrieving readable content:', error);
            callback(error, false);
        }
    },    


    getAllRows: async function(tableName) {
        try {
            const result = await BookmarkDB.query(`SELECT * FROM ${tableName}`);
            return result.rows; 
        } catch (error) {
            console.error(`Error retrieving all rows from table ${tableName}:`, error);
            throw error;
        }
    }
}

module.exports = getData;