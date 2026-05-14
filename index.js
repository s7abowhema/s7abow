const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.static(__dirname))

// إنشاء مجلد uploads
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads')
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// توليد اسم قصير مثل Catbox
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {

        const shortId =
            Math.random().toString(36).substring(2, 8)

        cb(null, shortId + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

// API رفع الملفات
app.post('/api/upload', upload.single('file'), (req, res) => {

    if (!req.file) {
        return res.json({
            status: false,
            message: 'No file uploaded'
        })
    }

    const fileUrl =
        `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

    res.json({
        status: true,
        creator: "s7abow",
        url: fileUrl
    })
})

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(PORT, () => {
    console.log(`s7abow running on port ${PORT}`)
})
