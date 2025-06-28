const {
    handleAnilistResponse,
    handleAniListData,
    handleError 
} = require("../externalResponseHandlers.js");
const cache = require("../cache/cache.js");


const mediaFormat = global.config.aniList.query.media; 
const url = global.config.aniList.baseUrl;
const isAdult = global.config.aniList.options.isAdult;
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
    }
};

function buildMangaQuery(filters, page) {
    const variableDefs = [];
    const mediaArgs = [];
    const variables = {};

    // Always include these
    variableDefs.push('$page: Int', '$perPage: Int', '$type: MediaType', '$sort: [MediaSort]');
    mediaArgs.push('type: $type', 'sort: $sort');
    variables.page = page || 1;
    variables.perPage = filters.perPage || 50;
    variables.type = 'MANGA';
    variables.sort = [filters.sort || 'POPULARITY_DESC'];

    // Conditionally add filters
    if (filters.genre_in) {
        variableDefs.push('$genre_in: [String]');
        mediaArgs.push('genre_in: $genre_in');
        variables.genre_in = filters.genre_in;
    }
    if (filters.status) {
        variableDefs.push('$status: MediaStatus');
        mediaArgs.push('status: $status');
        variables.status = filters.status;
    }
    if (filters.countryOfOrigin) {
        variableDefs.push('$countryOfOrigin: CountryCode');
        mediaArgs.push('countryOfOrigin: $countryOfOrigin');
        variables.countryOfOrigin = filters.countryOfOrigin;
    }

    
    variableDefs.push('$isAdult: Boolean');
    mediaArgs.push('isAdult: $isAdult');
    variables.isAdult = isAdult;


    console.log('mediaArgs -->', mediaArgs);
    console.log('variables -->', variables);
    

    // Build the query string
    const query = `
        query (${variableDefs.join(', ')}) {
            Page(page: $page, perPage: $perPage) {
                pageInfo { total currentPage lastPage hasNextPage perPage }
                media(${mediaArgs.join(', ')}) {
                ${mediaFormat}
                }
            }
        }
    `;

    return { query, variables };
}

function buildAnimeQuery(filters, page) {
    const variableDefs = [];
    const mediaArgs = [];
    const variables = {};

    // Always include these
    variableDefs.push('$page: Int', '$perPage: Int', '$type: MediaType', '$sort: [MediaSort]');
    mediaArgs.push('type: $type', 'sort: $sort');
    variables.page = page || 1;
    variables.perPage = filters.perPage || 50;
    variables.type = 'ANIME';
    variables.sort = [filters.sort || 'POPULARITY_DESC'];

    // Conditionally add filters
    if (filters.genre_in) {
        variableDefs.push('$genre_in: [String]');
        mediaArgs.push('genre_in: $genre_in');
        variables.genre_in = filters.genre_in;
    }
    if (filters.status) {
        variableDefs.push('$status: MediaStatus');
        mediaArgs.push('status: $status');
        variables.status = filters.status;
    }

    if (filters.format) {
        variableDefs.push('$format: MediaFormat');
        mediaArgs.push('format: $format');
        variables.format = filters.format;
    }

    // Compile the query string right here
    const query = `
        query (${variableDefs.join(', ')}) {
            Page(page: $page, perPage: $perPage) {
                pageInfo { total currentPage lastPage hasNextPage perPage }
                media(${mediaArgs.join(', ')}) {
                ${mediaFormat}
                }
            }
        }
    `;

    return { query, variables };
}

const getMangaContentFromAnilistByFilters = async (filters = {}, page = 1, perPage = 50, sort = 'POPULARITY_DESC') => {
    const keyBase = JSON.stringify(filters);
    const encodedFilters = encodeURIComponent(keyBase);
    const cacheKey = `anilist-filter-content:${page}:${encodedFilters}`;

    const cached = cache.get(cacheKey);
    if (cached) {
        return cached;
    }

    const {query, variables} = buildMangaQuery(filters, page);

    try {
        const response = await fetch(url, {
            ...options,
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        const rawData = await handleAnilistResponse(response);
        const allData = handleAniListData(rawData);
        cache.set(cacheKey, allData);

        return allData;

    } catch (error) {
        handleError(error);
        return {};
    }
};

const getAnimeContentFromAnilistByFilters = async (filters = {}, page = 1, perPage = 50, sort = 'POPULARITY_DESC') => {

    const {query, variables} = buildAnimeQuery(filters, page);

    try {
        console.log('calling anilist api for anime');
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

module.exports = { 
    getMangaContentFromAnilistByFilters, // for manga content
    getAnimeContentFromAnilistByFilters // for anime content
};
