import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import UserModel from "./models/user.js"
import { validationResult } from "express-validator";
import { registerValidation } from "./validations/auth.js"

mongoose.connect(
    'mongodb+srv://admin:admin123@cluster0.brczczf.mongodb.net/blog?retryWrites=true&w=majority',)
    .then(() => {
        console.log("MongoDB is successfully connected!");
    })
    .catch((err) => {
        console.log("MongoDB has failed to connect", err);
    });

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello world!");
});

app.post('/auth/register', registerValidation, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
        login: req.body.email,
        passwordHash,
    });

    const user = await doc.save();
    res.json(user);
});

app.post('/auth/login', (req, res) => {
    console.log(req.body);

    const token = jwt.sign({
        login: req.body.login,
        password: req.body.password
    }, 'lolkek');
    res.json({
        success: true,
        token,
    })
});
app.listen(4000, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server has started successfully!");
});