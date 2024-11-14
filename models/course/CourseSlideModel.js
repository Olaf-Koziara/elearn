const mongoose = require("mongoose");

const CourseSlideSchema = new mongoose.Schema({
    uid: {type: String},
    title: {type: String},
    duration: {type: Number, required: true, default: 400}, // Domyślny czas trwania w ms
    elements: [{type: mongoose.Schema.Types.ObjectId, ref: 'CourseSlideElement'}],
});
module.exports = mongoose.model('CourseSlide', CourseSlideSchema)