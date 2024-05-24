const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user.controllers');
const authentication = require('../Middleware/auth.middleware');
const authorizeEndpoint = require('../Middleware/endpoint.middleware');

router.get('/', authentication, authorizeEndpoint, userController.getUsers);
router.post('/', userController.postUser);
router.post('/login', userController.loginUser);

module.exports = router;