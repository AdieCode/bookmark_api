const express = require('express');
const router = express.Router();
const updateData = require('../../data/update.js');
require('dotenv').config(); 

router.post('/update_user_manga_content', (req, res, next) => {
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
        if (
            !data.user_id ||
            (data.status !== undefined  && !['planning', 'busy', 'completed'].includes(data.status))
        ) {
            console.error('Error occurred: Invalid user_id or status');
            return res.status(400).json({ success: false, message: 'data sent was incorrect' });
        }

        updateData.updateUserReadableContent(data, (error, response) => {
            if (error) {
                console.error('Error occurred /update_user_manga_content:', error);
                return res.status(500).json({success: false, message: 'Internal server error' });
            }

            if (response) {
                return res.status(200).json({success: true, message: 'User content was updated succesfully'});
            }
        })
        
    } catch (error) {
        console.error('Error occurred :', error);
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
});

router.post('/update_user_anime_content', (req, res, next) => {
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
        if (
            !data.user_id ||
            (data.status !== undefined  && !['planning', 'busy', 'completed'].includes(data.status))
        ) {
            console.error('Error occurred: Invalid user_id or status');
            return res.status(400).json({ success: false, message: 'data sent was incorrect' });
        }

        updateData.updateUserWatchableContent(data, (error, response) => {
            if (error) {
                console.error('Error occurred /update_user_manga_content:', error);
                return res.status(500).json({success: false, message: 'Internal server error' });
            }

            if (response) {
                return res.status(200).json({success: true, message: 'User content was updated succesfully'});
            }
        })
        
    } catch (error) {
        console.error('Error occurred :', error);
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
});

module.exports = router;