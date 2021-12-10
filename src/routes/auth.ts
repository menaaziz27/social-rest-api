import { registerUser } from '../controllers/authController';

const express = require('express');
const router = express.Router();

router.post('/register', registerUser);

module.exports = router;
