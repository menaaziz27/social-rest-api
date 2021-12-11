import { body } from 'express-validator';

export const commentValidation = [body('text').exists().isLength({ min: 4 }).trim()];
