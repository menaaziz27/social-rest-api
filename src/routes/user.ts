import { getUsers, createUsers, deleteUser, getDeletedUser } from '../controllers/userController';
import isAuth from '../middlewares/isAuth';

const express = require('express');
const router = express.Router();

router.route('/').get(getUsers).post(createUsers);
router.route('/:id').delete(isAuth(), deleteUser).get(isAuth(), getDeletedUser);

module.exports = router;
