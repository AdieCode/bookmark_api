const enrich = {
    enrichReadableContentData: function(currentData, neededData) {
    // Extract media data from neededData
    const mediaData = neededData.data.Page.media;

    const enrichedDataResults =  currentData.map(itemData => {
            if (itemData) {
                // Find the matching content in neededData based on content_id
                const enrichedData = mediaData.find(mediaItem => mediaItem.id === itemData.anilist_content_id);
                console.log(mediaItem)
                if (enrichedData) {
                    // Enrich missing fields in itemData with data from enrichedData
                    itemData.title = itemData.title || enrichedData.title.romaji;
                    itemData.genres = itemData.genres;
                    itemData.description = itemData.description || enrichedData.description;
                    itemData.cover_image_url = itemData.cover_image_url || enrichedData.coverImage.extraLarge;
                    itemData.type = itemData.type || enrichedData.type;
                    itemData.average_score = itemData.average_score || enrichedData.averageScore;
                    itemData.reading_status = itemData.reading_status || "Planning to read"
                    itemData.content_status = itemData.content_status || enrichedData.status; // Adjust as needed
                    itemData.average_score = enrichedData.averageScore || null
                    itemData.volumes = enrichedData.volumes || 0;
                    itemData.chapters = enrichedData.chapters || 0;
                }

                return itemData;
            }
            return itemData; 
        });
        return enrichedDataResults;
    },

    convertToStanderdContentFormat: function (mangaData) {
        if (!mangaData || !mangaData.data || !mangaData.data.Page || !Array.isArray(mangaData.data.Page.media)) {
            throw new Error('Invalid mangaData format');
        }

        const formatedData =  mangaData.data.Page.media.map(media => ({
            anilist_content_id: media.id,
            title: media.title.romaji || media.title.english || media.title.native,
            genres: media.genres,
            description: media.description || '',
            cover_image_url: media.coverImage.extraLarge,
            release_date: new Date(), // Default or actual release date if available
            type: media.type.toLowerCase(), // Ensure type matches the database format
            average_score: media.averageScore || null,
            volumes: media.volumes || 0,
            chapters: media.chapters || 0
        }));

        return formatedData;
    },

    convertToSendBackFormat: function(pageData, media) {
        const results = {
            data: {
                page: pageData,
                media
            }
        }
        return results
    }
}
module.exports = enrich;