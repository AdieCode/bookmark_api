const enrich = {
    enrichReadableContentData: function(currentData, neededData) {
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
                    itemData.cover_image_url = itemData.cover_image_url || enrichedData.coverImage.extraLarge || enrichedData.coverImage.large;
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

    convertRelationsToStanderdContentFormat: function (content) {
        if (!content || !Array.isArray(content)) {
            throw new Error('Invalid content format');
        };

        try {
            const formattedData = content.map(media => {
                const relations = media.node; // Access the mediaRecommendation node
                return {
                    anilist_content_id: relations.id,
                    title: relations.title || 'No Title',
                    genres: relations.genres || [],
                    description: relations.description || '',
                    cover_image_url: relations.coverImage?.extraLarge || relations.coverImage?.large || 'No Image',
                    type: relations.type || 'No Type', // Ensure type matches the database format
                    average_score: relations.averageScore || null,
                    volumes: relations.volumes || 0,
                    chapters: relations.chapters || 0,
                    episodes: relations.episodes || 0,
                    isAdult: relations.isAdult || false,
                    status: relations.status || 'no status',
                    relationType: media.relationType || 'no relationType',
                };
            });
            return formattedData;
        } catch (error) {
            throw new Error('Error formatting relations: ' + error.message);
        }
    },

    convertRecommendationsToStanderdContentFormat: function (content) {
        if (!content || !Array.isArray(content)) {
            throw new Error('Invalid content format');
        };
    
        try {
            const formattedData = content.map(media => {
                const recommendation = media.node.mediaRecommendation; // Access the mediaRecommendation node
                return {
                    anilist_content_id: recommendation?.id || 'No ID',
                    title: recommendation?.title || 'No Title',
                    genres: recommendation?.genres || [],
                    description: recommendation?.description || '',
                    cover_image_url: recommendation?.coverImage?.extraLarge || recommendation?.coverImage?.large || 'No Image',
                    type: recommendation?.type || 'No Type', // Ensure type matches the database format
                    average_score: recommendation?.averageScore || null,
                    volumes: recommendation?.volumes || 0,
                    chapters: recommendation?.chapters || 0,
                    episodes: recommendation?.episodes || 0,
                    isAdult: recommendation?.isAdult || false,
                    status: recommendation?.status || 'no status',
                };
            });
            return formattedData;
        } catch (error) {
            throw new Error('Error formatting recommendations: ' + error.message);
        }
    },


    convertCharactersToStanderdContentFormat: function (content) {
        if (!content || !Array.isArray(content)) {
            throw new Error('Invalid content format');
        }

        try {
            const formattedData = content.map(media => {
                const character = media.node; // Access the mediaRecommendation node
                return {
                    character_content_id: character?.id,
                    name: character?.name.full || 'No name',
                    role: media.role || "no role",
                    character_image_url: character?.image.large
                };
            });
            return formattedData;
        } catch (error) {
            throw new Error('Error formatting characters: ' + error.message);
        }
    },

    convertToStanderdContentFormat: function (mangaData) {

        if (!mangaData || !mangaData.data || !mangaData.data.Page || !Array.isArray(mangaData.data.Page.media)) {
            throw new Error('Invalid mangaData format');
        };
    
        try {
            const formattedData = mangaData.data.Page.media.map(media => ({
                anilist_content_id: media.id,
                title: media.title,
                genres: media.genres,
                description: media.description || '',
                cover_image_url: media.coverImage.extraLarge || media.coverImage.large,
                release_date: new Date(), // Default or actual release date if available
                type: media.type, // Ensure type matches the database format
                average_score: media.averageScore || null,
                volumes: media.volumes || 0,
                chapters: media.chapters || 0,
                episodes: media.episodes || 0,
                isAdult: media.isAdult,
                status: media.status || 'no status',
                relations: media.relations ? this.convertRelationsToStanderdContentFormat(media.relations.edges) : 'no relations found',
                recommendations: media.recommendations ? this.convertRecommendationsToStanderdContentFormat(media.recommendations.edges) : 'no recommendations',
                characters: media.characters ? this.convertCharactersToStanderdContentFormat(media.characters.edges) : 'no characters found'
            }));
    
            return formattedData;
        } catch (error) {
            throw new Error('Error formatting mangaData: ' + error.message);
        }
    },

    convertToSendBackFormat: function(pageData, media) {
        try {
            const results = {
                data: {
                    page: pageData,
                    media
                }
            }
            return results

        } catch (error) {
            return error
            console.error('Error occurred:', error);
        }
    }
}
module.exports = enrich;