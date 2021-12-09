import { getUsers, createUsers } from '../controllers/userController';

const express = require('express');
const router = express.Router();

router.post('/users', createUsers);
router.get('/users', getUsers);

module.exports = router;
