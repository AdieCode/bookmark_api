const express = require('express');
const router = express.Router();
const getContentFromAnilist = require("../../utils/anilist/aniList.js");
const getContentFromAnilistById = require("../../utils/anilist/getById.js");
const getContentBySearch = require("../../utils/anilist/getBySearch.js");
const {getMangaContentFromAnilistByFilters, getAnimeContentFromAnilistByFilters} = require("../../utils/anilist/getByFilter.js");
const enrich = require("../../utils/enrich.js")

router.get('/get_manga_content', async (req, res, next) => {
    try { 
        const currentPage = req.query.page || 1;

        let fetchedData = await getContentFromAnilist("MANGA", null, currentPage );

        if (!fetchedData || !fetchedData.data || !fetchedData.data.Page) {
            throw new Error('Invalid data from Anilist API');
        }

        const convertedFetchedResults = await enrich.convertToStanderdContentFormat(fetchedData, req);

        // const enrichedWithTrackedData = await enrich.addTrackedContentData(convertedFetchedResults, req?.user?.id);

        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, convertedFetchedResults);
        res.json(results);
    } catch (error) {
        console.error('Error occurred in /get_manga_content:', error);
        next(error);
    }
});

router.post('/get_manga_content_specific', async (req, res, next) => {
    const search = req.body.search;
    const page = req.body?.page || 1;
    const perPage = req.body?.perPage || 5;
    try {
        let fetchedData = await getContentFromAnilist("MANGA", search, page, perPage);
        const convertedFetchedResults = await enrich.convertToStanderdContentFormat(fetchedData, req);
        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, convertedFetchedResults);
        res.json(results);
    } catch (error) {
        console.error('Error occurred /get_manga_content_specific:', error);
        next(error);
    }
});

router.get('/get_anime_content', async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;

        let fetchedData = await getContentFromAnilist("ANIME", null, currentPage );

        if (!fetchedData || !fetchedData.data || !fetchedData.data.Page) {
            throw new Error('Invalid data from Anilist API');
        }

        const convertedFetchedResults = await enrich.convertToStanderdContentFormat(fetchedData, req) ;

        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, convertedFetchedResults);
        res.json(results);
    } catch (error) {
        console.error('Error occurred in /get_anime_content:', error);
        next(error);
    }
});

router.post('/get_anime_content_specific', async (req, res, next) => { 
    const search = req.body.search;
    try {
        let fetchedData = await getContentFromAnilist("ANIME", search, 1, 5); 
        const convertedFecthedResults = await enrich.convertToStanderdContentFormat(fetchedData, req)  
        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, convertedFecthedResults)
        res.json(results); 
    } catch (error) {
        console.error('Error occurred :', error);
        next(error);
    }
});

router.post('/get_content_by_id', async (req, res, next) => { 
    const id = req.body.id;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    try {
        let fetchedData = await getContentFromAnilistById(id); 
        const convertedFecthedResults = await enrich.convertToStanderdContentFormat(fetchedData, req) 
        // const enrichedWithTrackedData = await enrich.addTrackedContentData(convertedFecthedResults, req?.user?.id);
        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, convertedFecthedResults)
        res.json(results); 
    } catch (error) {
        console.error('Error occurred /get_manga_content_by_id:', error);
        next(error);
    }
});

router.get('/get_anime_content_by_id', async (req, res, next) => { 
    const id = req.body.id;
    try {
        let fetchedData = await (id); 
        const convertedFecthedResults = await enrich.convertToStanderdContentFormat(fetchedData, req)  
        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, convertedFecthedResults)
        res.json(results); 
    } catch (error) {
        console.error('Error occurred /get_anime_content_by_id:', error);
        next(error);
    } 
});

router.get('/get_content_by_search', async (req, res, next) => { 
    const search = req.query.search;
    const page = req.query?.page || 1;
    const perPage = req.query?.perPage || 5;

    try {
        let fetchedData = await getContentBySearch(search, page, perPage); 
        const convertedFetchedResults = await enrich.convertToStanderdContentFormat(fetchedData, req)  
        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, convertedFetchedResults)
        res.json(results); 
    } catch (error) {
        console.error('Error occurred /get_content_by_search:', error);
        next(error);
    } 
});

router.post('/get_manga_content_by_filters', async (req, res, next) => { 
    const filters = req.body.filters;
    const page = req.body.page || 1;
    if (!filters) {
        return res.status(400).json({ error: 'filters are required' });
    }

    try {
        let fetchedData = await getMangaContentFromAnilistByFilters(filters, page); 
        const convertedFecthedResults = await enrich.convertToStanderdContentFormat(fetchedData, req)  
        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, convertedFecthedResults)
        res.json(results); 
    } catch (error) {
        console.error('Error occurred /get_content_by_filters:', error);
        next(error);
    }
});

router.post('/get_anime_content_by_filters', async (req, res, next) => { 
    const filters = req.body.filters;
    const page = req.body.page || 1;
    if (!filters) {
        return res.status(400).json({ error: 'filters are required' });
    }

    try {
        let fetchedData = await getAnimeContentFromAnilistByFilters(filters, page); 
        const convertedFecthedResults = await enrich.convertToStanderdContentFormat(fetchedData, req)  
        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, convertedFecthedResults)
        res.json(results); 
    } catch (error) {
        console.error('Error occurred /get_content_by_filters:', error);
        next(error);
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