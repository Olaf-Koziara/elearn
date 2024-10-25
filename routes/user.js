const express = require('express');
const {register, login} = require("../controllers/authController");
const router = express.Router();

/* GET users listing. */
router.post('/register', register)
router.post('/login', login)
router.get('/profile', (req, res) => {
    
})

module.exports = router;
