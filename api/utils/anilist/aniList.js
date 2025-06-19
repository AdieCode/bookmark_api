const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../externalResponseHandlers.js");

const url =   global.config.aniList.baseUrl; 
const mediaFormat = global.config.aniList.query.media; 

const query = `
    query ($id: Int, $page: Int, $perPage: Int, $search: String, $type: MediaType, $sort: [MediaSort]) {
        Page(page: $page, perPage: $perPage) {
            pageInfo { 
                total 
                currentPage 
                lastPage 
                hasNextPage 
                perPage 
            }
            media(id: $id, search: $search, type: $type, sort: $sort) {
            ${mediaFormat}
            }
        }
    }
`;

const getContentFromAnilist = async (type = null, searchTerm = null, page = 1, perPage = 100, sort = 'POPULARITY_DESC') => {

    const variables = {
        search: searchTerm || null,  
        page: page,                 
        perPage: perPage,           
        type: type,              
        sort: searchTerm ? null : [sort] 
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
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
        return{}
    }
};

module.exports = getContentFromAnilist;
