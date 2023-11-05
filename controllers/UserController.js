import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import UserModel from "../models/user.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("VALIDATION ERROR LOLK");
            return res.status(400).json(errors.array());
        }

        /*res.json({
            success: true,
        })*/
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            login: req.body.login,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc;
        return res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Registration failed',
        });
    }

}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ login: req.body.login });

        if (!user) {
            return res.status(404).json({
                message: 'Authorization failedd',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Wrong login or password',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc;
        return res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Authorization failed',
        });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const { passwordHash, ...userData } = user._doc;
        return res.json(userData);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Have no access',
        });
    }
}