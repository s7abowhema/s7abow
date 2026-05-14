const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// تخزين في الذاكرة لتجنب قيود Vercel على القرص
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.json({ status: false, message: 'No file uploaded' });
    }

    try {
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        // محاولة الرفع لـ Catbox
        const response = await axios.post('https://catbox.moe/user/api.php', formData, {
            headers: formData.getHeaders(),
            timeout: 10000 // مهلة 10 ثواني
        });

        res.json({
            status: true,
            creator: "s7abow",
            url: response.data 
        });

    } catch (error) {
        res.status(500).json({ 
            status: false, 
            message: 'الخدمة قد تكون متوقفة حالياً، جرب لاحقاً أو اخبرني لتغيير السيرفر.' 
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
