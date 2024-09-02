var query = `
query ($id: Int, $page: Int, $perPage: Int, $search: String, $type: MediaType) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(id: $id, search: $search, type: $type) {
      id
      title {
        romaji
        english
        native
      }
      description
      type
      coverImage {
        extraLarge  
      }
      status
      averageScore 
    }
  }
}
`;

var variables = {
    search: "isekai",  // Change this to search for something else
    page: 1,              // The page number to fetch
    perPage: 100,           // Number of results per page
    type: "MANGA"       // Type of media to filter by
};

var url = 'https://graphql.anilist.co';
var options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        query: query,
        variables: variables
    })
};

const handleResponse = async (response) => {
    const json = await response.json();
    if (response.ok) {
        return json;
    } else {
        throw json;
    }
};

const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...'; // Append ellipsis
    }
    return description;
};

const handleData = (data) => {
    console.log('Data received:', data);
    if (data && data.data && data.data.Page && data.data.Page.media) {
        // Limit description length
        const maxLength = 200; // Set your desired maximum length here
        data.data.Page.media.forEach(item => {
            if (item.description) {
                item.description = truncateDescription(item.description, maxLength);
            }
        });

        console.log('Limited Data:', data);
        // Handle the limited data (e.g., render it to the page)
        return data;
    } else {
        throw new Error('Invalid data format');
    }
};

const handleError = (error) => {
    console.error('Error occurred:', error);
    // Handle errors (e.g., show a message to the user)
};

const getManga = async () => {
    try {
        const response = await fetch(url, options);
        const data = await handleResponse(response);
        return handleData(data);
    } catch (error) {
        handleError(error);
    }
};

getManga();

module.exports = getManga;
