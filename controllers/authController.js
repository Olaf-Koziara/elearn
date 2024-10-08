require('../models/user')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {json} = require("express");
const User = require("../models/user")
exports.register = async (req, res) => {
    try {
        let {email, password, passwordCheck, name, surname} = req.body;
        if (!email || !password || !passwordCheck)
            return res.status(400).json({msg: "Not all fields have been entered."});
        if (password.length < 5)
            return res
                .status(400)
                .json({msg: "The password needs to be at least 5 characters long."});
        if (password !== passwordCheck)
            return res
                .status(400)
                .json({msg: "Enter the same password twice for verification."});
        const existingAdmin = await Admin.findOne({email: email});
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
        res.status(200).send({success: true, user: {name: name, email: email}});
    } catch (error) {
        return res.status(500), json({success: failed, result: null, message: error.message});
    }


}