const express = require('express');
const mergeRouter = require('./routers/dataRouter');

const app = express();

// Gắn router với ứng dụng Express
app.use('/merge', mergeRouter);

// Cấu hình các middleware khác (nếu có)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
