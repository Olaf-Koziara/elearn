require('../models/user')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {json} = require("express");
const User = require("../models/user")
exports.register = async (req, res) => {

    try {

        let {email, password, confirmPassword, name, surname} = req.body;
        console.log(req.body)
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
    } catch (error) {
        return res.status(500);
    }


}
exports.login = async (req, res) => {
    console.log(process.env)
    try {
        const {email, password} = req.body;
        User.findOne({email}).then(user => {
            if (user.validPassword(password)) {
                const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: 3600});
                res.status(200).send({success: true, user: user, token});
            } else {
                res.status(500).send({success: false})
            }
        })
    } catch (error) {

    }
}