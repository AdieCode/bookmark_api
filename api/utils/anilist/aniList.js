const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../externalResponseHandlers.js");
const posthog = require("../posthog");

const url = global.config.aniList.baseUrl; 
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
        const startTime = Date.now();
        const requestBody = JSON.stringify({
            query: query,
            variables: variables
        });
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache' // Prevent cached responses
            },
            body: requestBody
        });
        
        const duration = Date.now() - startTime;
        const data = await handleAnilistResponse(response);
        
        // Track the API call in PostHog
        posthog.capture({
            distinctId: 'BookmarkAPI_Server',
            event: 'anilist_api_call',
            properties: {
                operation: 'getContentFromAnilist',
                method: 'POST',
                request_headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                request_body: {
                    type: variables.type,
                    search: variables.search,
                    page: variables.page,
                    perPage: variables.perPage,
                    sort: variables.sort
                },
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
                operation: 'getContentFromAnilist',
                method: 'POST',
                request_body: {
                    type: variables.type,
                    search: variables.search,
                    page: variables.page,
                    perPage: variables.perPage,
                    sort: variables.sort
                },
                error_message: error.message,
                error_stack: error.stack,
                success: false
            }
        });
        
        handleError(error);
        return{}
    }
};

module.exports = getContentFromAnilist;
