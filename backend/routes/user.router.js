const express = require('express');

const router = express.Router(); 
const userCtrl = require('../controllers/user.controller');

// /api/auth 
// --auth/signup => POST
// --auth/login => POST

router.post('/signup', userCtrl.signup); 
router.post('/login', userCtrl.login);

module.exports = router;