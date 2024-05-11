const express = require('express');
const path = require('path');
const router = express.Router();

// Định nghĩa tuyến đường cho trang index
router.get('/', async (req, res) => {
    // Logic xử lý cho trang chính nếu cần
    const indexPath = path.resolve(__dirname, '..', 'views', 'index.html');
    res.sendFile(indexPath);
});

// Các tuyến đường khác có thể được định nghĩa ở đây

module.exports = router;
