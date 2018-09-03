// jshint esversion:6
const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users-controller'); // user route controller


router.get('/admin/:password', UsersController.users_get_all_users);

// =========== [LOGIN] POST requests =========== //
router.post('/login', UsersController.users_login_user);

// =========== [SIGNUP] POST requests =========== //
router.post('/signup', UsersController.users_signup_user);

// =========== DELETE requests =========== //
router.delete('/:userId', UsersController.users_delete_user);


module.exports = router;