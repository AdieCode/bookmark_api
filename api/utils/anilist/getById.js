const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../externalResponseHandlers.js");

const query = global.config.aniList.query.getContentById; 
const url =   global.config.aniList.baseUrl;
const isAdult = global.config.aniList.options.isAdult;
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};

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
        console.log('Anilist response data:', data);
        return handleAniListData(data);
    } catch (error) {
        handleError(error);
        return {};
    }
};

module.exports = getContentFromAnilistById;
