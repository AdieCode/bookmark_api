const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../externalResponseHandlers.js");

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
        return handleAniListData(data);
    } catch (error) {
        handleError(error);
        return {};
    }
};

module.exports = getContentFromAnilistById;
