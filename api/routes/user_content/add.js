const express = require('express');
const router = express.Router();
const addData = require('../../data/add.js');

router.post('/add_user_manga_content', async (req, res) => { 

    const user_id = req.body.user_id;
    const content_id = req.body.content_id;
    const vol = req.body.vol;
    const chap = req.body.chap;
    const personal_score = req.body.personal_score;
    const content_status = req.body.content_status;

    try {
        addData.addUserReadableContent(user_id, content_id, vol, chap, personal_score, content_status, (error, response) => {
            if (error) {
                console.error('Error occurred :', error);
                return res.status(500).json({success: false, message: 'Internal server error' });
            }

            if (response) {
                return res.status(200).json({success: true, message: 'User content was added succesfully'});
            }
        })
        
    } catch (error) {
        console.error('Error occurred :', error);
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
});

router.post('/add_user_anime_content', async (req, res) => { 

    const user_id = req.body.user_id;
    const content_id = req.body.content_id;
    const current_season = req.body.current_season;
    const current_episode = req.body.current_episode;
    const personal_score = req.body.personal_score;
    const content_status = req.body.content_status;

    try {
        addData.addUserWatchableContent(user_id, content_id, current_season, current_episode, personal_score, content_status, (error, response) => {
            if (error) {
                console.error('Error occurred :', error);
                return res.status(500).json({success: false, message: 'Internal server error' });
            }

            if (response) {
                return res.status(200).json({success: true, message: 'User content was added succesfully'});
            }
        })
        
    } catch (error) {
        console.error('Error occurred :', error);
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
});

module.exports = router;
