const express = require('express');
const router = express.Router();
const getData = require('../../data/get.js');
const enrich = require("../../utils/enrich.js");

router.get('/get_user_manga_content', async (req, res) => { 
    const user_id = req.body.user_id || null;
    const content_id = req.body.content_id || null;
    console.log("the data : ", user_id, " | ", content_id);
    
    try {
        if (user_id) {
            getData.getUserReadableContent(user_id, (error, response) => {
                if (error) {
                    console.error(`Error at route /get_user_manga_content:`, error);
                    return res.status(500).json({ error: 'Internal server error: ' + error });
                }
				
                if (response) {
                    return res.status(200).json({ message: response, success: true });
                }
            });
        } else if (content_id) {
            getData.getReadableContent(content_id, (error, response) => {
                if (error) {
                    console.error(`Error at route /get_user_manga_content:`, error);
                    return res.status(500).json({ error: 'Internal server error: ' + error });
                }
				
                if (response) {
                    return res.status(200).json({ message: response, success: true });
                }
            });
        } else {
            console.error(`Error at route /get_user_manga_content: No user_id or content_id provided`);
            return res.status(400).json({ error: 'Missing user_id or content_id' });
        }
    } catch (error) {
        console.error(`Error at route /get_user_manga_content:`, error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/get_user_anime_content', async (req, res) => { 
    const user_id = req.body.user_id || null;
    const content_id = req.body.content_id || null;
    
    try {
        if (user_id) {
            getData.getUserWatchableContent(user_id, (error, response) => {
                if (error) {
                    console.error(`Error at route /get_user_anime_content:`, error);
                    return res.status(500).json({ error: 'Internal server error: ' + error });
                }
				
                if (response) {
                    return res.status(200).json({ message: response, success: true });
                }
            });
        } else if (content_id) {
            getData.getWatchableContent(content_id, (error, response) => {
                if (error) {
                    console.error(`Error at route /get_user_anime_content:`, error);
                    return res.status(500).json({ error: 'Internal server error: ' + error });
                }
				
                if (response) {
                    return res.status(200).json({ message: response, success: true });
                }
            });
        } else {
            console.error(`Error at route /get_user_anime_content: No user_id or content_id provided`);
            return res.status(400).json({ error: 'Missing user_id or content_id' });
        }
    } catch (error) {
        console.error(`Error at route /get_user_anime_content:`, error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
