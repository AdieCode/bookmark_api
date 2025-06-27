const express = require('express');
const router = express.Router();
const getContentFromAnilist = require("../../utils/anilist/aniList.js");
const getContentFromAnilistById = require("../../utils/anilist/getById.js");
const getContentBySearch = require("../../utils/anilist/getBySearch.js");
const {getMangaContentFromAnilistByFilters, getAnimeContentFromAnilistByFilters} = require("../../utils/anilist/getByFilter.js");
const enrich = require("../../utils/enrich.js")
const cache = require("../../utils/cache/cache.js");

router.get('/get_manga_content', async (req, res, next) => {
    try { 
        const currentPage = req.query.page || 1;
        const cacheKey = `manga-content-page:${currentPage}`;

        const cached = cache.get(cacheKey);
        if (cached) {
            console.log('Cache hit for key:', cacheKey);
            return res.json(cached);
        }

        let fetchedData = await getContentFromAnilist("MANGA", null, currentPage );

        if (!fetchedData || !fetchedData.data || !fetchedData.data.Page) {
            throw new Error('Invalid data from Anilist API');
        }

        const convertedFetchedResults = enrich.convertToStanderdContentFormat(fetchedData);

        const enrichedWithTrackedData = enrich.addTrackedContentData(convertedFetchedResults, req?.user?.id);

        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, enrichedWithTrackedData);
        cache.set(cacheKey, results);
        res.json(results);
    } catch (error) {
        console.error('Error occurred in /get_manga_content:', error);
        next(error);
    }
});

router.post('/get_manga_content_specific', async (req, res, next) => {
    const search = req.body.search;
    try {
        let fetcedData = await getContentFromAnilist("MANGA", search, 1, 5);
        const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData)
        const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
        res.json(results); 
    } catch (error) {
        console.error('Error occurred /get_manga_content_specific:', error);
        next(error);
    }
});

router.get('/get_anime_content', async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;
        const cacheKey = `anime-content-page:${currentPage}`;

        const cached = cache.get(cacheKey);
        if (cached) {
            console.log('Cache hit for key:', cacheKey);
            return res.json(cached);
        }

        let fetchedData = await getContentFromAnilist("ANIME", null, currentPage );

        if (!fetchedData || !fetchedData.data || !fetchedData.data.Page) {
            throw new Error('Invalid data from Anilist API');
        }

        const convertedFetchedResults = enrich.convertToStanderdContentFormat(fetchedData);

        const results = enrich.convertToSendBackFormat(fetchedData.data.Page.pageInfo, convertedFetchedResults);
        cache.set(cacheKey, results);
        res.json(results);
    } catch (error) {
        console.error('Error occurred in /get_anime_content:', error);
        next(error);
    }
});

router.post('/get_anime_content_specific', async (req, res, next) => { 
    const search = req.body.search;
    try {
        let fetcedData = await getContentFromAnilist("ANIME", search, 1, 5); 
        const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
        const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
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

    const cacheKey = `content:${id}`;

    const cached = cache.get(cacheKey);
    
    if (cached) {
        return res.json(cached);
    }

    try {
        let fetcedData = await getContentFromAnilistById(id); 
        const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
        const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
        cache.set(cacheKey, results);
        res.json(results); 
    } catch (error) {
        console.error('Error occurred /get_manga_content_by_id:', error);
        next(error);
    }
});

router.get('/get_anime_content_by_id', async (req, res, next) => { 
    const id = req.body.id;
    try {
        let fetcedData = await (id); 
        const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
        const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
        res.json(results); 
    } catch (error) {
        console.error('Error occurred /get_anime_content_by_id:', error);
        next(error);
    } 
});

router.get('/get_content_by_search', async (req, res, next) => { 
    const search = req.query.search;
    try {
        let fetcedData = await getContentBySearch(search, 1, 5); 
        const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
        const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
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

    const keyBase = JSON.stringify(filters);
    const encodedFilters = encodeURIComponent(keyBase);
    const cacheKey = `manga-content:${page}:${encodedFilters}`;

    const cached = cache.get(cacheKey);
    if (cached) {
        return res.json(cached);
    }

    try {
        let fetcedData = await getMangaContentFromAnilistByFilters(filters, page); 
        const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
        const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
        cache.set(cacheKey, results);
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

    const keyBase = JSON.stringify(filters);
    const encodedFilters = encodeURIComponent(keyBase);
    const cacheKey = `anime-content:${page}:${encodedFilters}`;

    const cached = cache.get(cacheKey);
    if (cached) {
        return res.json(cached);
    }

    try {
        let fetcedData = await getAnimeContentFromAnilistByFilters(filters, page); 
        const convertedFecthedResults = enrich.convertToStanderdContentFormat(fetcedData) 
        const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
        cache.set(cacheKey, results);
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