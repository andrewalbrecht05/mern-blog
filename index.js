import express from 'express';
import mongoose from 'mongoose';
import { registerValidation } from "./validations.js"
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js';

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

app.post('/auth/login', UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.listen(4000, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server has started successfully!");
});