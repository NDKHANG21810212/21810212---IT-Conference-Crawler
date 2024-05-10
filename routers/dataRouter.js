const express = require('express');
const router = express.Router();
const convertConferenceData = require('../controllers/gitAPIController');
const crawlTechEvents = require('../controllers/techController');
const mergeJsonData = require('../controllers/mergedController');

router.get('/merge', async (req, res) => {
    try {
        // Gọi các hàm từ controller để lấy dữ liệu
        await mergeJsonData();
        await convertConferenceData();
        await crawlTechEvents();
       
        
        res.send('mergeJsonData executed successfully!');
    } catch (error) {
        res.status(500).send('Error occurred while running mergeJsonData');
    }
});

module.exports = router;
