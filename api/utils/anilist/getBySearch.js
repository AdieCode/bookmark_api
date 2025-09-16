const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../externalResponseHandlers.js");
const posthog = require("../posthog");

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
        const startTime = Date.now();
        const requestHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache' // Prevent cached responses
        };
        
        const requestBody = JSON.stringify({
            query: query,
            variables: variables
        });
        
        const response = await fetch(url, {
            ...options,
            headers: requestHeaders,
            body: requestBody
        });
        
        const duration = Date.now() - startTime;
        const data = await handleAnilistResponse(response);
        
        // Track the API call in PostHog
        posthog.capture({
            distinctId: 'BookmarkAPI_Server',
            event: 'anilist_api_call',
            properties: {
                operation: 'getContentBySearch',
                method: 'POST',
                request_headers: requestHeaders,
                request_body: {
                    search: variables.search,
                    page: variables.page,
                    perPage: variables.perPage,
                    sort: variables.sort
                },
                query: query,
                response_status: response.status,
                response_ok: response.ok,
                duration_ms: duration,
                success: true
            }
        });
        
        return handleAniListData(data);
    } catch (error) {
        // Track the API call error in PostHog
        posthog.capture({
            distinctId: 'BookmarkAPI_Server',
            event: 'anilist_api_call',
            properties: {
                operation: 'getContentBySearch',
                method: 'POST',
                request_body: {
                    search: variables.search,
                    page: variables.page,
                    perPage: variables.perPage,
                    sort: variables.sort
                },
                query: query,
                error_message: error.message,
                error_stack: error.stack,
                success: false
            }
        });
        
        handleError(error); 
        return {}
    }
};

module.exports = getContentBySearch;