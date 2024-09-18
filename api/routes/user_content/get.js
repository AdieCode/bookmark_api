const express = require('express');
const router = express.Router();
const getData = require('../../data/get.js');
const enrich = require("../../utils/enrich.js");

router.get('/get_user_manga_content', async (req, res) => { 
	const user_id = req.body.user_id;

	try {
		getData.getUserReadableContent(user_id, (error, response) => {
			if (error) {
				console.error('Error occurred :', error);
				return res.status(500).json({success: false, message: 'Internal server error' });
			}

			if (response) {
				return res.status(200).json({success: true, message: response});
			}
		})
		
	} catch (error) {
		console.error('Error occurred :', error);
		return res.status(500).json({success: false, message: 'Internal server error' });
	}
});

router.get('/get_user_anime_content', async (req, res) => { 
	const user_id = req.body.user_id;
		
	try {
		getData.getUserWatchableContent(user_id, (error, response) => {
			if (error) {
				console.error('Error occurred :', error);
				return res.status(500).json({success: false, message: 'Internal server error' });
			}

			if (response) {
				return res.status(200).json({success: true, message: response});
			}
		})
		
	} catch (error) {
		console.error('Error occurred :', error);
		return res.status(500).json({success: false, message: 'Internal server error' });
	}
});

router.get('/get_user_manga_content_contentId', async (req, res) => { 
	const content_id = req.body.content_id;

	try {
		getData.getReadableContent(content_id, (error, response) => {
			if (error) {
				console.error('Error occurred :', error);
				return res.status(500).json({success: false, message: 'Internal server error' });
			}

			if (response) {
				return res.status(200).json({success: true, message: response});
			}
		})
		
	} catch (error) {
		console.error('Error occurred :', error);
		return res.status(500).json({success: false, message: 'Internal server error' });
	}
});

router.get('/get_user_anime_content_contentId', async (req, res) => { 
	const content_id = req.body.content_id;
		
	try {
		getData.getWatchableContent(content_id, (error, response) => {
			if (error) {
				console.error('Error occurred :', error);
				return res.status(500).json({success: false, message: 'Internal server error' });
			}

			if (response) {
				return res.status(200).json({success: true, message: response});
			}
		})
		
	} catch (error) {
		console.error('Error occurred :', error);
		return res.status(500).json({success: false, message: 'Internal server error' });
	}
});

module.exports = router;
