const express = require('express');
const router = express.Router();
const addData = require('../../data/add.js');

router.post('/add_manga_content', async (req, res) => { 

    const anilist_content_id = req.body.anilist_content_id;
    const title = req.body.title;
    const description = req.body.description;
    const cover_image_url = req.body.cover_image_url;
    const release_date = req.body.release_date;

    try {
        addData.addReadableContent(anilist_content_id, title, description, cover_image_url, release_date, "MANGA", (error, response) => {
            if (error) {
                console.error('Error occurred :', error);
                return res.status(500).json({success: false, message: 'Internal server error' });
            }

            if (response) {
                return res.status(200).json({success: true, message: 'Content was added succesfully'});
            }
        })
        
    } catch (error) {
        console.error('Error occurred :', error);
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
});

router.post('/add_anime_content', async (req, res) => { 

    const anilist_content_id = req.body.anilist_content_id;
    const title = req.body.title;
    const description = req.body.description;
    const cover_image_url = req.body.cover_image_url;
    const release_date = req.body.release_date;

    try {
        addData.addWatchableContent(anilist_content_id, title, description, cover_image_url, release_date, "ANIME", (error, response) => {
            if (error) {
                console.error('Error occurred :', error);
                return res.status(500).json({success: false, message: 'Internal server error' });
            }

            if (response) {
                return res.status(200).json({success: true, message: 'Content was added succesfully'});
            }
        })
        
    } catch (error) {
        console.error('Error occurred :', error);
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
});

module.exports = router;
