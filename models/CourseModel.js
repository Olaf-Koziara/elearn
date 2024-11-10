const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: String, required: true},
    createdAt: {type: String, required: true},
    thumbnail: {type: String}, // Link do miniatury
    slides: [{type: mongoose.Schema.Types.ObjectId, ref: 'CourseSlide'}],
});

module.exports = mongoose.model('Course', CourseSchema);
