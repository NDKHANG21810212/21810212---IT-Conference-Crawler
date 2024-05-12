const express = require('express');
const path = require('path');
const router = express.Router();

// Định nghĩa tuyến đường cho trang index
router.get('/', async (req, res) => {
    const indexPath = path.resolve(__dirname, '..', 'views', 'index.html');
    res.sendFile(indexPath);
});



module.exports = router;