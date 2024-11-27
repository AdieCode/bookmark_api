var query = `
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
            id
            title {
                romaji
                english
                native
            }
            genres 
            description
            type
            coverImage { 
                large 
            }
            status
            averageScore
            volumes
            chapters
            isAdult
        }
    }
}
`;

var url = 'https://graphql.anilist.co';
var options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};

const handleResponse = async (response) => {
    const json = await response.json();
    if (response.ok) {
        return json;
    } else {
        throw json;
    }
};

const handleData = (data) => {
    if (data && data.data && data.data.Page && data.data.Page.media) {
        return data;
    } else {
        throw new Error('Invalid data format');
    }
};

const handleError = (error) => {
    console.error('Error occurred:', error);
};

const getContentFromAnilist = async (type = null, searchTerm = null, page = 1, perPage = 100, sort = 'POPULARITY_DESC') => {
    // Set variables dynamically based on searchTerm
    var variables = {
        search: searchTerm || null,  // Use the search term or default to null if empty
        page: page,                  // Default to page 1
        perPage: perPage,            // Default to 100 results per page
        type: type,               // Static filter for media type
        sort: searchTerm ? null : [sort] // If search term is provided, don't use sort, otherwise use sorting
    };

    try {
        // Merge the query with the updated variables
        const response = await fetch(url, {
            ...options,
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });
        const data = await handleResponse(response);
        return handleData(data);
    } catch (error) {
        return{}
        handleError(error);
    }
};

module.exports = getContentFromAnilist;
