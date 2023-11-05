import { body } from "express-validator";

export const registerValidation = [
    body('login').isLength({min: 4}),
    body('password').isLength({min: 5}),
    //body('avatarUrl').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Enter article name').isLength({min: 3}).isString(),
    body('text', 'Enter text of article').isLength({min: 10}).isString(),
    body('tags', 'Incorrect tag format(indicate array)').optional().isString(),
    body('imageUrl', 'Incorrect image URL').optional().isURL(),
]