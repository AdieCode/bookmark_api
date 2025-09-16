const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../externalResponseHandlers.js");
const posthog = require("../posthog");

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
        const startTime = Date.now();
        const requestBody = JSON.stringify({
            query: query,
            variables: variables
        });
        
        const response = await fetch(url, {
            ...options,
            body: requestBody
        });

        const duration = Date.now() - startTime;
        const data = await handleAnilistResponse(response);
        
        // Track the API call in PostHog
        posthog.capture({
            distinctId: 'BookmarkAPI_Server',
            event: 'anilist_api_call',
            properties: {
                operation: 'getContentFromAnilistByIdList',
                method: 'POST',
                request_headers: options.headers,
                request_body: {
                    id_list: variables.id_in,
                    id_count: variables.id_in.length,
                    page: variables.page,
                    perPage: variables.perPage
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
                operation: 'getContentFromAnilistByIdList',
                method: 'POST',
                request_body: {
                    id_list: variables.id_in,
                    id_count: variables.id_in.length,
                    page: variables.page,
                    perPage: variables.perPage
                },
                error_message: error.message,
                error_stack: error.stack,
                success: false
            }
        });
        
        handleError(error);
        throw error;
    }
};

module.exports = getContentFromAnilistByIdList;
