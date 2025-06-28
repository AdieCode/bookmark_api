const express = require('express');
const router = express.Router();
const addData = require('../../data/add.js');
const cache = require("../../utils/cache/cache.js");

router.post('/add_user_manga_content', async (req, res) => { 
    console.log('add_user_manga_content : ', req.user);
    console.log('status : ', req.body?.content_status);

    const data = {
        user_id: req?.user?.id,
        anilist_id: req?.body?.content_id,
        current_volume: req?.body?.vol,
        current_chapter: req?.body?.chap,
        current_page: req?.body?.page,
        score: req?.body?.personal_score,
        status: req?.body?.content_status,
        start_date: req?.body?.start_date,
        end_date: req?.body?.end_date,
        user_comment: req?.body?.user_comment,
        deleted: req?.body?.deleted,
    }

    try {
        if (!data.anilist_id || !data.user_id || !['planning', 'busy', 'completed'].includes(data.status)) {
            console.error('Error occurred: Invalid anilist_id or user_id or status', '\n response recieved ==> ', JSON.stringify(data));
            return res.status(400).json({ success: false, message: 'data sent was incorrect' });
        }

        addData.addUserReadableContent(data, (error, response) => {
            if (error) {
                console.error('Error occurred /add_user_manga_content:', error);
                return res.status(500).json({success: false, message: 'Internal server error' });
            }

            if (!response) {
                return res.status(409).json({success: true, message: 'User content was already added'});
            } else {
                const cacheKey = `user-tracked-content-readable:${data.user_id}`;

                cache.delete(cacheKey);
                return res.status(200).json({success: true, message: 'User content was added succesfully'});
            }
            
        })
        
    } catch (error) {
        console.error('Error occurred :', error);
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
});

router.post('/add_user_anime_content', async (req, res) => { 

    const data = {
        user_id: req?.user?.id,
        anilist_id: req?.body?.content_id,
        current_episode: req?.body?.current_episode,
        score: req?.body?.personal_score,
        status: req?.body?.content_status,
        start_date: req?.body?.start_date,
        end_date: req?.body?.end_date,
        user_comment: req?.body?.user_comment,
        deleted: req?.body?.deleted,
    }

    try {
        if (!data.anilist_id || !data.user_id || !['planning', 'busy', 'completed'].includes(data.status)) {
            console.log('Error occurred: Invalid anilist_id or user_id or status', 'response recieved ==> ', JSON.stringify(data));
            return res.status(400).json({ success: false, message: 'data sent was incorrect' });
        }

        addData.addUserWatchableContent(data, (error, response) => {
            if (error) {
                console.error('Error occurred /add_user_anime_content:', error);
                return res.status(500).json({success: false, message: 'Internal server error' });
            }

            if (!response) {
                return res.status(409).json({success: true, message: 'User content was already added'});
            } else {
                return res.status(200).json({success: true, message: 'User content was added succesfully'});
            }
        })
        
    } catch (error) {
        console.error('Error occurred :', error);
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
});

module.exports = router;
