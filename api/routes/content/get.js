const express = require('express');
const router = express.Router();
const getContentFromAnilist = require("../../utils/anilist/aniList.js");
const getContentFromAnilistById = require("../../utils/anilist/getById.js");
const enrich = require("../../utils/enrich.js")

router.get('/get_manga_content', async (req, res) => {
    try { 
		const currentPage = req.query.page || 1;
        let fetchedData = await getContentFromAnilist("MANGA", null, currentPage );

        if (!fetchedData || !fetchedData.data || !fetchedData.data.Page) {
            throw new Error('Invalid data from Anilist API');
        }

        const convertedFetchedResults = enrich.convertToStanderdContentFormat(fetchedData);

        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, convertedFetchedResults);
        res.json(results);
    } catch (error) {
        console.error('Error occurred in /get_manga_content:', error);

        res.status(500).json({
            success: false,
            message: 'Error occurred while fetching manga content',
            error: error.message || 'Unknown error'
        });
    }
});

router.post('/get_manga_content_specific', async (req, res) => {
	const search = req.body.search;
	try {
		let fetcedData = await getContentFromAnilist("MANGA", search, 1, 3);
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

router.post('/get_manga_content_by_id', async (req, res) => { 
	const id = req.body.id;
	console.log("this is the ID GIVEN: ", req.body) 
	try {
		let fetcedData = await getContentFromAnilistById(id); 
		const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
		const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
		res.json(results); 
	} catch (error) {
		console.error('Error occurred /get_manga_content_by_id:', error);
		res.status(500).send('Error occurred: ' + error.message);
	}
});

router.get('/get_anime_content_by_id', async (req, res) => { 
	const id = req.body.id;
	try {
		let fetcedData = await getContentFromAnilistById(id); 
		const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
		const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
		res.json(results); 
	} catch (error) {
		console.error('Error occurred /get_anime_content_by_id:', error);
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