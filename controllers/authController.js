require('../models/UserModel')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {json} = require("express");
const User = require("../models/UserModel")
const {catchErrors} = require("../handlers/errorHandlers");
exports.register = catchErrors(async (req, res) => {
    let {email, password, confirmPassword, name, surname} = req.body;
    if (!email || !password || !confirmPassword)
        return res.status(400).json({msg: "Not all fields have been entered."});
    if (password.length < 5)
        return res
            .status(400)
            .json({msg: "The password needs to be at least 5 characters long."});
    if (password !== confirmPassword)
        return res
            .status(400)
            .json({msg: "Enter the same password twice for verification."});
    const existingAdmin = await User.findOne({email: email});
    if (existingAdmin)
        return res
            .status(400)
            .json({msg: "An account with this email already exists."});

    if (!name) name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        email,
        password: passwordHash,
        name,
        surname,
    });
    await newUser.save();
    console.log(newUser);
    res.status(200).send({success: true, user: {name: name, email: email}});


})
exports.login = catchErrors(async (req, res) => {

    const {email, password} = req.body;
    if (email && password) {
        User.findOne({email}).then(user => {
            if (user && user.validPassword(password)) {
                const token = jwt.sign({email, user}, process.env.JWT_SECRET, {expiresIn: 3600});
                res.status(200).send({success: true, user: user, token});
            } else {
                res.status(400).send({success: false, error: "user doesnt exist"})
            }
        })
    } else {
        if (!email) {
            res.status(400).send({success: false, error: "Email required"})
        }
        if (!password) {
            res.status(400).send({success: false, error: "Password required"})
        }
    }

})
exports.authorization = catchErrors(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const jwtToken = authHeader.split(' ')[1];

    if (jwtToken) {


        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const user = await User.findOne({email: decoded.email}).select('-password');
        res.status(200).send(user).end()


    } else {
        res.status(400).end();
    }


})