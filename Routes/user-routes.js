const express = require('express');
const userControllers = require('../controllers/user-controllers'); // Fix variable name

const router = express.Router();

router.post('/register', userControllers.register);
router.post('/resetpassword', userControllers.resetpassword);
router.get('/checkunique', userControllers.checkUnique);
router.get('/get-user', userControllers.getUser);
router.get('/forgetpassword', userControllers.forgetPassword);

module.exports = router;
