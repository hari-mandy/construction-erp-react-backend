const express = require('express');
const userControllers = require('../controllers/user-controllers'); // Fix variable name

const router = express.Router();

router.post('/register', userControllers.register);
router.post('/resetpassword', userControllers.resetpassword);
router.post('/updateuser', userControllers.updateuser);
router.get('/checkunique', userControllers.checkUnique);
router.get('/get-user', userControllers.getUser);
router.get('/forgetpassword', userControllers.forgetPassword);
router.get('/validtoken', userControllers.validToken);
router.get('/getalluser', userControllers.getalluser);
router.get('/getcitys', userControllers.getcitys);
router.get('/getusercity', userControllers.getusercity);

module.exports = router;
