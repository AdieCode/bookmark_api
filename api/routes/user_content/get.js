const express = require('express');
const router = express.Router();
const getData = require('../../data/get.js');
const getContentFromAnilistByIdList = require("../../utils/anilist/getByIdList.js");
const enrich = require("../../utils/enrich.js");
const httpStatus = require('../../utils/responseTools/httpStatus.js');

router.get('/get_user_manga_content', async (req, res) => { 

    const user_id = req?.user?.id;
    const status = req.query?.content_status;
    const page = req.query?.page || 1;

    try {
        let userContent = [];
        let idList = [];

        if (!user_id || !['planning', 'busy', 'completed'].includes(status)) {
            console.log('Error occurred: Invalid param user_id or status');
            return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'data sent was incorrect' });
        }

        getData.getUserReadableContent(user_id, status, async (error, response) => {
            if (error) {
                console.error('Error occurred /get_user_manga_content:', error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: 'Internal server error' });
            }

            if (Array.isArray(response)) {
                userContent = response;     
            } else {
                console.error('Expected an array but got:', yourVariable);
            }

            userContent.forEach((content) => {
                if (content?.anilist_id) {
                    idList.push(content.anilist_id);
                }   
            })
    
            const fetcedData = await getContentFromAnilistByIdList(idList, page);
            const convertedFecthedResults = await enrich.convertToStanderdContentFormat(fetcedData, req)
            const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
        
            res.json(results); 
        })

        
    } catch (error) {
        console.error('Error occurred :', error);
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
});

router.get('/get_user_anime_content', async (req, res) => { 

    const user_id = req?.user?.id;
    const status = req.query?.content_status;
    const page = req.query?.page || 1;

    try {
        let userContent = [];
        let idList = [];

        if (!user_id || !['planning', 'busy', 'completed'].includes(status)) {
            console.log('Error occurred: Invalid param user_id or status');
            return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'data sent was incorrect' });
        }

        getData.getUserReadableContent(user_id, status, async (error, response) => {
            if (error) {
                throw new Error(error)
            }

            if (Array.isArray(response)) {
                userContent = response;     
            } else {
                throw new Error('Expected an array but got:', yourVariable);
            }

            userContent.forEach((content) => {
                if (content?.anilist_id) {
                    idList.push(content.anilist_id);
                }   
            })
    
            const fetcedData = await getContentFromAnilistByIdList(idList, page);
            const convertedFecthedResults = await enrich.convertToStanderdContentFormat(fetcedData, req)
            const results = enrich.convertToSendBackFormat(fetcedData.data.Page.pageInfo, convertedFecthedResults)
        
            res.json(results); 
        })

        
    } catch (error) {
        console.error('Error occurred /get_user_anime_content:', error);
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
});

module.exports = router;
