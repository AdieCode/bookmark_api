const handleAnilistResponse = async (response) => {
    const json = await response.json();
    if (response.ok) {
        return json;
    } else {
        throw json;
    }
};

const handleAniListData = (data) => {
    console.log('Handling Anilist data:', JSON.stringify(data));
    if (data && data.data && data.data.Page && data.data.Page.media) {
        return data;
    } else {
        throw new Error('Anilist response data had an invalid data format');
    }
};

const handleAniListDataForCharacter = (data) => {
    console.log('Handling Anilist character data:', data);
    if (data && data.data && data.data.Character) {
        return data;
    } else {
        throw new Error('Anilist response data for character had an invalid data format');
    }   
};

// const handleAniListData = (data) => {
//     if (data && data.data && data.data.Page && data.data.Page.media) {
//         return {
//             ok: true,
//             data: data
//         };
//     } else {
//         // return {
//         //     ok: false,
//         //     error: 'Data recieved from Anilist is not in the expected format',
//         //     data: null
//         // }
//         throw new Error('Data recieved from Anilist is not in the expected format');
//     }
// };

const handleError = (error) => {
    console.log('Error after calling anilist occurred:', error);
};

module.exports = {
    handleAnilistResponse,
    handleAniListData,
    handleAniListDataForCharacter,
    handleError
};