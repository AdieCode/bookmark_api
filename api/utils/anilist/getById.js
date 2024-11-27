var query = `
query ($id: Int) {
    Page {
        pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
        }
        media(id: $id) {
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
                extraLarge  
            }
            status
            averageScore
            volumes
            chapters
            isAdult
            relations {
                edges {
                    relationType
                    node {
                        id
                        title {
                            romaji
                            english
                        }
                        coverImage {
                            extraLarge
                        }
                        type
                        status
                        isAdult
                    }
                }
            }
            recommendations {
                edges {
                    node {
                        id
                        mediaRecommendation {
                            id
                            title {
                                romaji
                                english
                            }
                            coverImage {
                                extraLarge
                            }
                            type
                            status
                            averageScore
                            isAdult
                        }
                        rating
                    }
                }
            }
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

// Function to get content from Anilist by ID
const getContentFromAnilistById = async (id) => {
    // Check if ID is provided
    if (!id) {
        throw new Error('ID is required to fetch content');
    }

    var variables = {
        id: id,  // Set the id of the media to fetch
    };

    try {
        // Make the fetch request with the updated variables
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
        handleError(error);
        return {}; // Return empty object on error
    }
};

module.exports = getContentFromAnilistById;
