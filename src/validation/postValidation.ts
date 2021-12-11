import { check } from 'express-validator';

export const createPostValidation = [
	check('title').notEmpty().isLength({ min: 1 }).withMessage('Title should exist'),
	check('content').notEmpty().isLength({ min: 1 }).withMessage('Content should exist'),
];

export const updatePostValidation = [
	check('title').optional().notEmpty().withMessage('Title should exist'),
	check('content').optional().notEmpty().withMessage('Content should exist'),
];
