const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// إعداد multer لاستلام أي نوع ملف في الذاكرة
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // حد أقصى 100 ميجا للملف
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.json({ status: false, message: 'لم يتم اختيار ملف' });
    }

    try {
        const formData = new FormData();
        
        // إرسال الملف الخام مع الحفاظ على اسمه ونوعه الأصلي
        formData.append('files[]', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        // الرفع إلى سيرفر Quax (يدعم الصور والفيديو والملفات المضغوطة وغيرها)
        const response = await axios.post('https://qu.ax/upload.php', formData, {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        if (response.data && response.data.files && response.data.files[0]) {
            res.json({
                status: true,
                creator: "s7abow",
                url: response.data.files[0].url,
                name: response.data.files[0].name,
                type: req.file.mimetype // إرجاع نوع الملف للتأكد
            });
        } else {
            throw new Error('استجابة غير صالحة من السيرفر');
        }

    } catch (error) {
        console.error('Upload Error:', error.message);
        res.status(500).json({ 
            status: false, 
            message: 'فشل الرفع، السيرفر قد يكون مضغوطاً حالياً.' 
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
