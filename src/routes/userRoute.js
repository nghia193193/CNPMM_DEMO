const express = require('express');
const User = require('../models/userModel');
const userController = require('../controllers/userController');

const router = express.Router()

router.get('/profile', userController.getProfile);
router.get('/admin', userController.getAdminPage);

module.exports = router;