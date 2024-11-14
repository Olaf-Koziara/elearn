const mongoose = require("mongoose");
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
module.exports = mongoose.model('CourseSlideElement', CourseSlideElementSchema)