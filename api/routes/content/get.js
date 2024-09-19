const express = require('express');
const router = express.Router();
const getContentFromAnilist = require("../../utils/aniList.js");
const enrich = require("../../utils/enrich.js")

router.get('/get_manga_content', async (req, res) => { 
    try {
		let fetcedData = await getContentFromAnilist("MANGA"); 
		const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
		const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
		res.json(results); 
    } catch (error) {
		console.error('Error occurred in /get_manga_content:', error);
		res.status(500).send('Error occurred: ' + error.message);
    }
});

router.get('/get_manga_content_specific', async (req, res) => { 
	const search = req.body.search;
	try {
		let fetcedData = await getContentFromAnilist("MANGA", search); 
		const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
		const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
		res.json(results); 
	} catch (error) {
		console.error('Error occurred /get_manga_content_specific:', error);
		res.status(500).send('Error occurred: ' + error.message);
	}
});

router.get('/get_anime_content', async (req, res) => { 
	try {
		let fetcedData = await getContentFromAnilist("ANIME"); 
		const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
		const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
		res.json(results); 
	} catch (error) {
		console.error('Error occurred in /get_anime_content:', error);
		res.status(500).send('Error occurred: ' + error.message);
	}
});

router.get('/get_anime_content_specific', async (req, res) => { 
	const search = req.body.search;
	try {
		let fetcedData = await getContentFromAnilist("ANIME", search); 
		const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
		const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
		res.json(results); 
	} catch (error) {
		console.error('Error occurred :', error);
		res.status(500).send('Error occurred: ' + error.message);
	}
});

module.exports = router;

// itemArray: {
//   Page: {
//     pageInfo: {
//       total: 5000,
//       currentPage: 1,
//       lastPage: 100,
//       hasNextPage: true,
//       perPage: 50
//     },
//     media: [
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object]
//     ]
//   }
// }