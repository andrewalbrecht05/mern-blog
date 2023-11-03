import { body } from "express-validator";

export const registerValidation = [
    body('login').isLength({min: 4}),
    body('password').isLength({min: 5}),
    body('avatarUrl').optional().isURL(),
];