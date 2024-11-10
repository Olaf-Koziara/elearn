const {catchErrors} = require("../handlers/errorHandlers");
const Course = require("../models/CourseModel")

exports.createCourse = catchErrors(async (req, res) => {

    try {
        const newCourse = new Course({
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            createdAt: new Date().toISOString(),
            thumbnail: req.file ? `/uploads/${req.file.filename}` : null, // Link do miniatury
        });

        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})
