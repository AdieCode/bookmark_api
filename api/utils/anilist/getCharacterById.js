const {
    handleAnilistResponse,
    handleAniListDataForCharacter,
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
 
const charactersDataFormat = global.config.aniList.query.charactersData; 

const query = `
    query ($characterId: Int) {
        Character(id: $characterId) {
            ${charactersDataFormat}
        }
    }
`;


const getCharacterDataFromAnilistById = async (characterId) => {

    if (!characterId) {
        throw new Error('ID is required to fetch character data');
    }

    const cacheKey = `anilist-character-data-by-id:${characterId}`;

    const cached = cache.get(cacheKey);
    
    if (cached) {
        // Track cache hit in PostHog
        posthog.capture({
            distinctId: 'BookmarkAPI_Server',
            event: 'anilist_api_call',
            properties: {
                operation: 'getCharacterDataFromAnilistById',
                method: 'CACHE',
                request_body: {
                    characterId: characterId
                },
                query: query,
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
        characterId: characterId
    };

    try {
        const startTime = Date.now();
        logger.info('fetching data from anilsit by character ID', origin);
        
        const requestBody = JSON.stringify({
            query: query,
            variables: variables
        });
        
        const response = await fetch(url, {
            ...options,
            body: requestBody
        });
        
        logger.info('character data fetched from anilsit by ID', origin);
        const duration = Date.now() - startTime;
        const data = await handleAnilistResponse(response);
        const handledData = handleAniListDataForCharacter(data);
        
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
                query: query,
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
                query: query,
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

module.exports = getCharacterDataFromAnilistById;
