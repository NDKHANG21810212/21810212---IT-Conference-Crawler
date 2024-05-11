const express = require('express');
const app = express();
const fs = require('fs').promises;
const path = require('path');

const mergeJsonData = require('./controllers/mergedController');
const convertConferenceData = require('./controllers/gitAPIController');
const crawlTechEvents = require('./controllers/techController');
const dataRouter = require('./routers/dataRouter');

app.use(express.static('public')); // Phục vụ các file tĩnh từ thư mục 'public'
// Đường dẫn đến file JSON
const jsonFilePath = path.join(__dirname, 'data', 'combined_data.json');
let hasMerged = false;

// Sự kiện 'listening' được kích hoạt khi máy chủ bắt đầu lắng nghe các kết nối
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
    // Code của bạn ở đây...
});

app.use('/data', express.static(path.join(__dirname, 'data')));
// Sử dụng router từ dataRouter.js
app.use('/', dataRouter);

async function automaticDataCrawl() {
    // Gọi các hàm crawler
   
    await convertConferenceData();
    await crawlTechEvents();
    await mergeJsonData();
    // In thông báo về việc crawl dữ liệu và thiết lập lại sau 24 tiếng
    console.log('Scheduled data crawling in 24 hours.');

    // Thiết lập lại timeout cho lần tiếp theo sau 24 tiếng
    setTimeout(automaticDataCrawl, 24 * 60 * 60 * 1000); // 24 tiếng = 24 * 60 * 60 * 1000 milliseconds
}

// Gọi hàm tự động để bắt đầu quá trình tự động crawl dữ liệu khi máy chủ khởi động
automaticDataCrawl();

// Khởi động máy chủ
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
    // Gọi các hàm từ controller để thực hiện các tác vụ khi máy chủ khởi động
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
