import { registerUser, loginUser, refreshToken } from '../controllers/authController';
import isAuth from '../middlewares/isAuth';

const express = require('express');
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/refresh', isAuth({ ignoreExpiredTokens: true }), refreshToken);

module.exports = router;
