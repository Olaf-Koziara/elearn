const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: String, required: true},
    createdAt: {type: String, required: true},
    thumbnail: {type: String}, // Link do miniatury
    slides: [{type: mongoose.Schema.Types.ObjectId, ref: 'CourseSlideSchema'}],
});
const CourseSlideSchema = new mongoose.Schema({
    title: {type: String},
    duration: {type: Number, required: true, default: 400}, // Domyślny czas trwania w ms
    elements: [{type: mongoose.Schema.Types.ObjectId, ref: 'CourseSlideElement'}],
});

const CourseSlideElementSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['text', 'image']
    },
    position: {
        x: {type: Number, required: true},
        y: {type: Number, required: true},
    },
    size: {
        width: {type: Number},
        height: {type: Number},
    },
    content: {type: String},
    url: {type: String},
    fontSize: {type: String},
});
mongoose.model('CourseSlideElement', CourseSlideElementSchema)
module.exports.Course = mongoose.model('Course', CourseSchema);
module.exports.CourseSlide = mongoose.model('CourseSlide', CourseSlideSchema)
module.exports.CourseSlideElement = mongoose.model('CourseSlideElement', CourseSlideElementSchema)