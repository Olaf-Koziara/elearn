const express = require('express');
const router = express.Router();
const multer = require("multer");
const {createCourse} = require("../controllers/courseController");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, (path.join(__dirname, '..', 'public', 'uploads')))// Ścieżka do zapisu plików
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({storage});
router.post('/create', upload.single("thumbnail"), createCourse)
module.exports = router;