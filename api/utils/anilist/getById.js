const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../externalResponseHandlers.js");
const cache = require("../cache/cache.js");
const logger = require("../../utils/logger.js");
origin = 'getById.js - getContentFromAnilistById()';

// const query = global.config.aniList.query.getContentById; 
const url =   global.config.aniList.baseUrl;
// const isAdult = global.config.aniList.options.isAdult;
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};

const mediaFormat = global.config.aniList.query.media; 
const relationsFormat = global.config.aniList.query.relations; 
const recommendationsFormat = global.config.aniList.query.recommendations; 
const charactersFormat = global.config.aniList.query.characters; 

const query = `
    query ($id: Int) {
        Page {
            pageInfo { 
                total 
                currentPage 
                lastPage 
                hasNextPage 
                perPage 
            }
            media(id: $id) {
            ${mediaFormat}
            ${relationsFormat}
            ${recommendationsFormat}
            ${charactersFormat}
            }
        }
    }
`;


const getContentFromAnilistById = async (id) => {

    if (!id) {
        throw new Error('ID is required to fetch content');
    }

    const cacheKey = `anilist-content-by-id:${id}`;

    const cached = cache.get(cacheKey);
    
    if (cached) {
        // console.log('Cache hit for key:', cacheKey);
        return cached;
    }

    const variables = {
        id: id
    };

    try {
        
        logger.info('fetching data from anilsit by ID', origin);
        const response = await fetch(url, {
            ...options,
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });
        logger.info('data fetched from anilsit by ID', origin);
        
        const data = await handleAnilistResponse(response);
        const handledData = handleAniListData(data);
        cache.set(cacheKey, handledData);
        return handledData;
    } catch (error) {
        logger.error(error, origin);
        handleError(error);
        throw error;
    }
};

module.exports = getContentFromAnilistById;
