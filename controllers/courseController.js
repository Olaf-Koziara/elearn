const {catchErrors} = require("../handlers/errorHandlers");
const Course = require("../models/CourseModel")
const jwt = require("jsonwebtoken");

exports.createCourse = catchErrors(async (req, res) => {

    try {
        const newCourse = new Course({
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            createdAt: new Date().toISOString(),
            thumbnail: req.file ? `${process.env.BASE_URL}/uploads/${req.file.filename}` : null, // Link do miniatury
        });

        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

exports.getCourses = catchErrors(async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const jwtToken = authHeader.split(' ')[1];

        if (jwtToken) {
            const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

            const courses = await Course.find({author: decoded.email}); // Znalezienie kursów dla danego autora
            res.status(200).json(courses);
        }
    } catch (error) {
        res.status(500).json({message: 'Błąd podczas pobierania kursów', error: error.message});
    }
})




