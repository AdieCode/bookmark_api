const query = global.config.aniList.query.getContentById; 
var url =   global.config.aniList.baseUrl;

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
        console.log('12345:\n',JSON.stringify(data))
        return handleData(data);
    } catch (error) {
        handleError(error);
        return {}; // Return empty object on error
    }
};

module.exports = getContentFromAnilistById;
