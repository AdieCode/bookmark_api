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

const query = `
    query ($id_in: [Int], $page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage){
            pageInfo { 
                total 
                currentPage 
                lastPage 
                hasNextPage 
                perPage 
            }
            media(id_in: $id_in) {
            ${mediaFormat}
            }
        }
    }
`;


const getContentFromAnilistByIdList = async (idList,  page = 1, perPage = 100, sort = 'POPULARITY_DESC') => {
    if (!idList) {
        throw new Error('ID list is required to fetch content');
    }

    const variables = {
        id_in: idList,
        page: page,                 
        perPage: perPage,
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
        // console.log('Response from AniList:', data.status, JSON.stringify(data));
        return handleAniListData(data);
    } catch (error) {
        handleError(error);
        throw error;
    }
};

module.exports = getContentFromAnilistByIdList;
