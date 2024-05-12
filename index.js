const express = require('express');
const app = express();
const fs = require('fs').promises;
const path = require('path');

const mergeJsonData = require('./controllers/mergedController');
const convertConferenceData = require('./controllers/gitAPIController');
const crawlTechEvents = require('./controllers/techController');
const dataRouter = require('./routers/dataRouter');

app.use(express.static('public')); 
// Đường dẫn đến file JSON
const jsonFilePath = path.join(__dirname, 'data', 'combined_data.json');
let hasMerged = false;


app.on('listening', async () => {
    if (!hasMerged) {
        try {
            // Gọi các hàm từ controller để thực hiện các tác vụ khi máy chủ khởi động
            await mergeJsonData();
            await convertConferenceData();
            await crawlTechEvents();
            console.log('Initial data processing completed successfully!');
            hasMerged = true; // Đánh dấu đã merge dữ liệu một lần
        } catch (error) {
            console.error('Error occurred during initial data processing:', error);
        }
    }
});

// Route SSE để gửi dữ liệu mới tới client
app.get('/data/stream', async (req, res) => {
   
});

app.use('/data', express.static(path.join(__dirname, 'data')));

app.use('/', dataRouter);

async function automaticDataCrawl() {  
    await convertConferenceData();
    await crawlTechEvents();
     await mergeJsonData();
    console.log('Scheduled data crawling in 24 hours.');
    setTimeout(automaticDataCrawl, 24 * 60 * 60 * 1000); 
}
automaticDataCrawl();

// Khởi động máy chủ
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
    if (!hasMerged) {
        try {
            await crawlTechEvents();
            await convertConferenceData();
            await mergeJsonData();
            
           
            console.log('Initial data processing completed successfully!');
            hasMerged = true; // Đánh dấu đã merge dữ liệu một lần
        } catch (error) {
            console.error('Error occurred during initial data processing:', error);
        }
    }
    console.log(`Server is running on port ${PORT}`);
});
