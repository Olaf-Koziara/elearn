var express = require('express');
const {register} = require("../controllers/authController");
var router = express.Router();

/* GET users listing. */
router.post('/user', register)
router.get('/user', (req, res) => {
    res.status(200).json({usr: 'ss'})
})

module.exports = router;
