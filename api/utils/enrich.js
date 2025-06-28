const getData = require('../../api/data/get.js');
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

    convertRelationsToStanderdContentFormat: async function (content, req) {
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

            const formattedDataEnriched = await this.addTrackedContentData(formattedData, req?.user?.id);

            return formattedDataEnriched;
        } catch (error) {
            throw new Error('Error formatting relations: ' + error.message);
        }
    },

    convertRecommendationsToStanderdContentFormat: async function (content, req) {
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

            const formattedDataEnriched = await this.addTrackedContentData(formattedData, req?.user?.id);

            return formattedDataEnriched;
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

    convertToStanderdContentFormat: async function (contentData, req) {

        if (!contentData || !contentData.data || !contentData.data.Page || !Array.isArray(contentData.data.Page.media)) {
            throw new Error('Invalid contentData format');
        };
    
        try {
            const formattedData = await Promise.all(contentData.data.Page.media.map(async(media) => ({
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
                relations: media.relations ? await this.convertRelationsToStanderdContentFormat(media.relations.edges, req) : 'no relations found',
                recommendations: media.recommendations ? await this.convertRecommendationsToStanderdContentFormat(media.recommendations.edges, req) : 'no recommendations',
                characters: media.characters ? this.convertCharactersToStanderdContentFormat(media.characters.edges) : 'no characters found'
            })));

            const formattedDataEnriched =  await this.addTrackedContentData(formattedData, req?.user?.id);
    
            return formattedDataEnriched;
        } catch (error) {
            throw new Error('Error formatting contentData : ' + error.message);
        }
    },

    addTrackedContentData: async function (content, user_id) {
        if (!content || !Array.isArray(content)) {
            throw new Error('Invalid content format - addTrackedContentData()');
        };

        const trackedReadableContent = await new Promise((resolve, reject) => {
            getData.getAllUserReadableContent(user_id, (error, data) => {
                if (error) return reject(new Error('Error retrieving readable tracked content: ' + error.message));
                resolve(data);
            });
        });

        const trackedWatchableContent = await new Promise((resolve, reject) => {
            getData.getAllUserWatchableContent(user_id, (error, data) => {
                if (error) return reject(new Error('Error retrieving watchable tracked content: ' + error.message));
                resolve(data);
            });
        });
        console.log('trackedWatchableContent', trackedWatchableContent)

        const trackedReadableMap = {};
        for (const item of trackedReadableContent) {
            trackedReadableMap[item.anilist_id] = item;
        }

        const trackedWatchableMap = {};
        for (const item of trackedWatchableContent) {
            trackedWatchableMap[item.anilist_id] = item;
        }

        try {
            const formattedData = content.map(media => {

                if (media?.type === "MANGA") {
                    const trackedData = trackedReadableMap[media.anilist_content_id] || {};
    
                    const newItem = {...media,
                        tracked: {
                            personal_score: trackedData?.score || 0,
                            current_volume: trackedData?.current_volume || 0,
                            current_chapter: trackedData?.current_chapter || 0,
                            current_page: trackedData?.current_page || 0,
                            status: trackedData?.status || 'UNTRACKED',
                            user_comment: trackedData?.user_comment || 'no comment',
                        }
                    }

                    return newItem;
                } else {
                    const trackedData = trackedWatchableMap[media.anilist_content_id] || {};
                    // console.log(JSON.stringify(trackedData))
    
                    const newItem = {...media,
                        tracked: {
                            personal_score: trackedData?.score || 0,
                            current_episode: trackedData?.current_episode || 0,
                            status: trackedData?.status || 'UNTRACKED',
                            user_comment: trackedData?.user_comment || 'no comment',
                        }
                    }
                    
                    return newItem;

                }



            });
            return formattedData;
        } catch (error) {
            throw new Error('Error adding tracked content data: ' + error.message);
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
    },
}
module.exports = enrich;