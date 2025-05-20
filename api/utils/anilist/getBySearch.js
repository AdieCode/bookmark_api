const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../responseHandlers.js");

const query = global.config.aniList.query.getContentBySearch; 
const url =   global.config.aniList.baseUrl; 
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', 
    }
};

const getContentBySearch = async (searchTerm = null, page = 1, perPage = 100, sort = 'POPULARITY_DESC') => {
    // Set variables dynamically based on searchTerm
    var variables = {
        search: searchTerm || null,  // Use the search term or default to null if empty
        page: page,                  // Default to page 1
        perPage: perPage,            // Default to 100 results per page
        sort: [sort] // If search term is provided, don't use sort, otherwise use sorting
    };

    try {
        // Merge the query with the updated variables
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
        console.log("Response from AniList:", response);
        const data = await handleAnilistResponse(response);
        return handleAniListData(data);
    } catch (error) {
        handleError(error); 
        return {}
    }
};

module.exports = getContentBySearch;