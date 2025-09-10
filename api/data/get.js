const BookmarkDB = require('./pool.js');
const { checkPassword } = require('../utils/passwordUtils.js');
const cache = require("../../api/utils/cache/cache.js");

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

            if (!checkPassword) {
                console.error('checkPassword function is undefined');
                callback(new Error('Authentication system error'), false);
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

        const cacheKey = `user-tracked-content-readable:${user_id}`;

        const cached = cache.get(cacheKey);
        
        if (cached) {
            callback(null, cached);
        }

        try {
            const result = await BookmarkDB.query(
                'SELECT * FROM readable_tracked_content WHERE user_id = $1',
                [user_id]
            );
    
            if (result.rows.length > 0) {
                cache.set(cacheKey, result.rows);
                callback(null, result.rows);
            } else {
                callback(null, []);
            }
        } catch (error) {
            console.error('Error retrieving user readable content:', error);
            callback(error, false);
        }
    },

    getAllUserWatchableContent: async function(user_id, callback) {

        const cacheKey = `user-tracked-content-watchable:${user_id}`;

        const cached = cache.get(cacheKey);
        
        if (cached) {
            callback(null, cached);
        }

        try {
            const result = await BookmarkDB.query(
                'SELECT * FROM watchable_tracked_content WHERE user_id = $1',
                [user_id]
            );
    
            if (result.rows.length > 0) {
                cache.set(cacheKey, result.rows);
                callback(null, result.rows);
            } else {
                callback(null, []);
            }
        } catch (error) {
            console.error('Error retrieving user watchable content:', error);
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
                callback(null, []);
            }
        } catch (error) {
            console.error('Error retrieving user readable content:', error);
            callback(error, false);
        }
    },
    
    getUserWatchableContent: async function(user_id, status, callback) {
        try {
            const result = await BookmarkDB.query(
                'SELECT * FROM watchable_tracked_content WHERE user_id = $1 AND status = $2',
                [user_id, status]
            );
    
            if (result.rows.length > 0) {
                callback(null, result.rows);
            } else {
                callback(null, []);
            }
        } catch (error) {
            console.error('Error retrieving user watchable content:', error);
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

    getUserContentCounts: async function(user_id, callback) {
        try {
            // Get readable content counts (manga)
            const readableCountsResult = await BookmarkDB.query(`
                SELECT 
                    COUNT(*) as total_count,
                    COUNT(CASE WHEN status = 'planning' THEN 1 END) as planning_count,
                    COUNT(CASE WHEN status = 'busy' THEN 1 END) as busy_count,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
                FROM readable_tracked_content 
                WHERE user_id = $1 AND (deleted IS NULL OR deleted = false)
            `, [user_id]);

            // Get watchable content counts (anime)
            const watchableCountsResult = await BookmarkDB.query(`
                SELECT 
                    COUNT(*) as total_count,
                    COUNT(CASE WHEN status = 'planning' THEN 1 END) as planning_count,
                    COUNT(CASE WHEN status = 'busy' THEN 1 END) as busy_count,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
                FROM watchable_tracked_content 
                WHERE user_id = $1 AND (deleted IS NULL OR deleted = false)
            `, [user_id]);

            const readableCounts = readableCountsResult.rows[0] || {
                total_count: 0,
                planning_count: 0,
                busy_count: 0,
                completed_count: 0
            };

            const watchableCounts = watchableCountsResult.rows[0] || {
                total_count: 0,
                planning_count: 0,
                busy_count: 0,
                completed_count: 0
            };

            const result = {
                manga: {
                    totalCount: parseInt(readableCounts.total_count),
                    planningCount: parseInt(readableCounts.planning_count),
                    busyCount: parseInt(readableCounts.busy_count),
                    completedCount: parseInt(readableCounts.completed_count)
                },
                anime: {
                    totalCount: parseInt(watchableCounts.total_count),
                    planningCount: parseInt(watchableCounts.planning_count),
                    busyCount: parseInt(watchableCounts.busy_count),
                    completedCount: parseInt(watchableCounts.completed_count)
                }
            };

            callback(null, result);
        } catch (error) {
            console.error('Error retrieving user content counts:', error);
            callback(error, null);
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