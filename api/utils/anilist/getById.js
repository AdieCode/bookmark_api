const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../externalResponseHandlers.js");
const cache = require("../cache/cache.js");
const logger = require("../../utils/logger.js");
const posthog = require("../posthog");
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
        // Track cache hit in PostHog
        posthog.capture({
            distinctId: 'BookmarkAPI_Server',
            event: 'anilist_api_call',
            properties: {
                operation: 'getContentFromAnilistById',
                method: 'CACHE',
                request_body: {
                    id: id
                },
                response_status: 200,
                response_ok: true,
                duration_ms: 0,
                success: true,
                cached: true
            }
        });
        return cached;
    }

    const variables = {
        id: id
    };

    try {
        const startTime = Date.now();
        logger.info('fetching data from anilsit by ID', origin);
        
        const requestBody = JSON.stringify({
            query: query,
            variables: variables
        });
        
        const response = await fetch(url, {
            ...options,
            body: requestBody
        });
        
        logger.info('data fetched from anilsit by ID', origin);
        const duration = Date.now() - startTime;
        const data = await handleAnilistResponse(response);
        const handledData = handleAniListData(data);
        
        // Track the API call in PostHog
        posthog.capture({
            distinctId: 'BookmarkAPI_Server',
            event: 'anilist_api_call',
            properties: {
                operation: 'getContentFromAnilistById',
                method: 'POST',
                request_headers: options.headers,
                request_body: {
                    id: variables.id
                },
                response_status: response.status,
                response_ok: response.ok,
                duration_ms: duration,
                success: true,
                cached: false
            }
        });
        
        cache.set(cacheKey, handledData);
        return handledData;
    } catch (error) {
        // Track the API call error in PostHog
        posthog.capture({
            distinctId: 'BookmarkAPI_Server',
            event: 'anilist_api_call',
            properties: {
                operation: 'getContentFromAnilistById',
                method: 'POST',
                request_body: {
                    id: variables.id
                },
                error_message: error.message,
                error_stack: error.stack,
                success: false
            }
        });
        
        logger.error(error, origin);
        handleError(error);
        throw error;
    }
};

module.exports = getContentFromAnilistById;
