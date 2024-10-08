var express = require('express');
const {register} = require("../controllers/authController");
var router = express.Router();

/* GET users listing. */
router.post('/register', register)
router.get('/', (req, res) => {
    res.status(200).json({usr: 'ss'})
})

module.exports = router;
