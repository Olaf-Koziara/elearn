const {catchErrors} = require("../handlers/errorHandlers");
const jwt = require("jsonwebtoken");

const CourseSlideElement = require("../models/course/CourseSlideElementModel")
const CourseSlide = require("../models/course/CourseSlideModel");
const Course = require("../models/course/CourseModel");
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
exports.getCourseById = catchErrors(async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId).populate({
            path: 'slides',
            model: CourseSlide,
            populate: {path: 'elements', model: CourseSlideElement}
        })
        res.status(200).json(course);


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

            const courses = await Course.find({author: decoded.email});
            res.status(200).json(courses);
        }
    } catch (error) {
        res.status(500).json({message: 'Błąd podczas pobierania kursów', error: error.message});
    }
})

exports.updateCourse = catchErrors(async (req, res) => {
    try {
        const courseData = req.body; // Jeśli kurs jest w formacie JSON


        const updatedSlides = await Promise.all(
            courseData.slides.map(async (slide) => {
                let savedSlide;

                // Jeśli slajd nie ma `_id`, utwórz nowy dokument
                if (!slide._id) {
                    const slideDoc = new CourseSlide({
                        title: slide.title,
                        elements: [], // Tymczasowo puste, zostaną zaktualizowane później
                    });
                    savedSlide = await slideDoc.save();
                } else {
                    savedSlide = await CourseSlide.findById(slide._id);
                }

                const newElements = slide.elements.filter(element => !element._id);


                const savedElements = await Promise.all(
                    newElements.map(async (element) => {
                        const elementDoc = new CourseSlideElement(element);
                        return await elementDoc.save();
                    })
                );


                const elementsWithIds = slide.elements.map(element => {
                    if (!element._id) {
                        const savedElement = savedElements.find(
                            saved => saved.type === element.type && saved.content === element.content
                        );
                        return savedElement._id;
                    }
                    return element._id;
                });

                savedSlide = await CourseSlide.findByIdAndUpdate(
                    savedSlide._id,
                    {
                        ...slide,
                        elements: elementsWithIds,
                    },
                    {new: true}
                );

                return savedSlide._id;
            })
        );


        // 3. Zaktualizuj kurs z nowymi referencjami do slajdów
        const updatedCourse = await Course.findByIdAndUpdate(
            courseData._id,
            {
                ...courseData,
                slides: updatedSlides, // Wstaw tylko `ObjectId` dla slajdów
            },
            {new: true}
        );
        res.status(200).send('updated');
    } catch (error) {
        console.error(error);
        res.status(500).send({message: error.message});
    }
})
exports.deleteCourseById = catchErrors(async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const jwtToken = authHeader.split(' ')[1];

        if (jwtToken) {
            const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
            const courseId = req.params.id;
            if (courseId) {
                await Course.findOneAndDelete({_id: courseId, author: decoded.email}).then(() => {
                    res.status(200).send(courseId)
                });


            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message: error.message});
    }
})
exports.uploadFilesWithIds = catchErrors(async (req, res) => {
    try {

        const uploadedFiles = req.files.map((file) => {
            const id = file.fieldname.split('-')[1]; // Wyodrębnij ID z nazwy pola
            return {
                id,
                originalname: file.originalname,
                filename: file.filename,
                path: `${process.env.BASE_URL}/uploads/${file.filename}`
            };
        });

        res.status(200).send({
            message: 'Files uploaded successfully',
            files: uploadedFiles
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({message: error.message});
    }
});
exports.updateSlide = catchErrors(async (req, res) => {
    try {
        const {courseId, slideData} = json.parse(req.body)
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send({message: 'Course not found'});
        }
        const slideIndex = course.slides.findIndex(slide => slide._id.toString() === slideData.id);
        if (slideIndex === -1) {
            return res.status(404).send({message: 'Slide not found'});
        }
        course.slides[slideIndex] = {
            ...course.slides[slideIndex],
            ...slideData
        }
        await course.save();


        res.status(200).send({message: 'Slide updated successfully'});
    } catch (err) {
        res.status(500).send({message: 'Error updating slide', error: err.message});
    }
})