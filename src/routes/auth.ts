import { registerUser, loginUser, refreshToken } from '../controllers/authController';
import isAuth from '../middlewares/isAuth';
import { loginValidation, registerValidation } from '../validation/authValidation';

const express = require('express');
const router = express.Router();

router.post('/register', registerValidation, registerUser);

router.post('/login', loginValidation, loginUser);

router.post('/refresh', isAuth({ ignoreExpiredTokens: true }), refreshToken);

module.exports = router;
