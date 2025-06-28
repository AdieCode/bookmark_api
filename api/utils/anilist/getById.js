const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../externalResponseHandlers.js");
const cache = require("../cache/cache.js");

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
        console.log('Cache hit for key:', cacheKey);
        return cached;
    }

    const variables = {
        id: id
    };

    try {
        const response = await fetch(url, {
            ...options,
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });
        
        const data = await handleAnilistResponse(response);
        const handledData = handleAniListData(data);
        cache.set(cacheKey, handledData);
        return handledData;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

module.exports = getContentFromAnilistById;
