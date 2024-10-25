const express = require('express');
const {register, login, authorization} = require("../controllers/authController");
const router = express.Router();

/* GET users listing. */
router.get('/profile', authorization)
router.post('/register', register)
router.post('/login', login)


module.exports = router;
