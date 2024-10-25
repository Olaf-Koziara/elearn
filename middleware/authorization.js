const jwt = require("jsonwebtoken");
const User = require("../models/user")

module.exports.authorization = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (authHeader) {
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findOne({email: decoded.email}).select('-password');
        
    }
    next();
}