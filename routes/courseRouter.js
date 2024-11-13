const express = require('express');
const router = express.Router();
const multer = require("multer");
const {createCourse, getCourses, uploadFilesWithIds, updateCourse} = require("../controllers/courseController");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, (path.join(__dirname, '..', 'public', 'uploads')))// Ścieżka do zapisu plików
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({storage});
router.get('/', getCourses)
router.post('/create', upload.single("thumbnail"), createCourse)
router.post('/files/upload', upload.any(), uploadFilesWithIds)
router.put('/', updateCourse)

module.exports = router;