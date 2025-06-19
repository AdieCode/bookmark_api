const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../externalResponseHandlers.js");

const url =   global.config.aniList.baseUrl; 
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', 
    }
};

const mediaFormat = global.config.aniList.query.media; 

const query = `
    query ($page: Int, $perPage: Int, $search: String, $sort: [MediaSort]) {
        Page(page: $page, perPage: $perPage) {
            pageInfo { 
                total 
                currentPage 
                lastPage 
                hasNextPage 
                perPage 
            }
            media(search: $search, sort: $sort) {
            ${mediaFormat}
            }
        }
    }
`;

const getContentBySearch = async (searchTerm = null, page = 1, perPage = 100, sort = 'POPULARITY_DESC') => {
    const variables = {
        search: searchTerm || null,  
        page: page,                  
        perPage: perPage,            
        sort: [sort] 
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache' // Prevent cached responses
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });
        
        const data = await handleAnilistResponse(response);
        return handleAniListData(data);
    } catch (error) {
        handleError(error); 
        return {}
    }
};

module.exports = getContentBySearch;