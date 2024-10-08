const express = require('express');
const router = express.Router();
const updateData = require('../../data/update.js');
require('dotenv').config(); 

router.post('/update_user_manga_content', (req, res, next) => {
    const user_id = req.body.user_id || null;
    const content_id = req.body.content_id || null;
    const fields = req.body.fields || null;

    try {
        if (user_id) {
            updateData.updateUserReadableContentFieldsById(user_id, fields, (error, response) => {
                if (error) {
                    console.error(`Error at route /update_user_manga_content:`, error);
                    return res.status(500).json({ error: 'Internal server error: ' + error });
                }
        
                if (response) {
                    return res.status(200).json({ message: 'User list updated successfully', success: true });
                }
            });
        } else if (content_id) {
            updateData.updateUserReadableContentFieldsByContentId(content_id, fields, (error, response) => {
                if (error) {
                    console.error(`Error at route /update_user_manga_content:`, error);
                    return res.status(500).json({ error: 'Internal server error: ' + error });
                }
        
                if (response) {
                    return res.status(200).json({ message: 'User list updated successfully', success: true });
                }
            });
        } else {
            console.error(`Error at route /update_user_manga_content: No user_id or content_id provided`);
            return res.status(400).json({ error: 'Missing user_id or content_id' });
        }
    } catch (error) {
        console.error(`Error at route /update_user_manga_content:`, error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post('/update_user_anime_content', (req, res, next) => {
    const user_id = req.body.user_id || null;
    const content_id = req.body.content_id || null;
    const fields = req.body.fields || null;

    try {
        if (user_id) {
            updateData.updateUserWatchableContentFieldsById(user_id, fields, (error, response) => {
                if (error) {
                    console.error(`Error at route /update_user_anime_content:`, error);
                    return res.status(500).json({ error: 'Internal server error: ' + error });
                }
    
                if (response) {
                    return res.status(200).json({ message: 'User list updated successfully', success: true });
                }
            });
        } else if (content_id) {
            updateData.updateUserWatchableContentFieldsByContentId(content_id, fields, (error, response) => {
                if (error) {
                    console.error(`Error at route /update_user_anime_content:`, error);
                    return res.status(500).json({ error: 'Internal server error: ' + error });
                }
        
                if (response) {
                    return res.status(200).json({ message: 'User list updated successfully', success: true });
                }
            });
        } else {
            console.error(`Error at route /update_user_anime_content: No user_id or content_id provided`);
            return res.status(400).json({ error: 'Missing user_id or content_id' });
        }
    } catch (error) {
        console.error(`Error at route /update_user_anime_content:`, error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;