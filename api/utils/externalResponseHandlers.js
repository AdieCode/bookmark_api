const handleAnilistResponse = async (response) => {
    const json = await response.json();
    if (response.ok) {
        return json;
    } else {
        throw json;
    }
};

const handleAniListData = (data) => {
    if (data && data.data && data.data.Page && data.data.Page.media) {
        return data;
    } else {
        throw new Error('Anilist response data had an invalid data format');
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
    handleError
};