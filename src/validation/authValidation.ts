import { check } from 'express-validator';

export const registerValidation = [
	check('name')
		.exists()
		.isString()
		.isLength({ min: 3 })
		.withMessage('Name is required at should be 3 characters at least'),
	check('email').isString().isEmail().exists().withMessage('Email is invalid'),
	check('password')
		.isLength({ min: 5 })
		.isAlphanumeric()
		.trim()
		.withMessage('Password should be alphanumeric and 5 characters at least.'),
];

export const loginValidation = [
	check('email').isString().isEmail().exists().withMessage('Email is invalid'),
	check('password')
		.isLength({ min: 5 })
		.isAlphanumeric()
		.trim()
		.withMessage('Password should be alphanumeric and 5 characters at least.'),
];
