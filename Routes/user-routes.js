const express = require('express');
const userControllers = require('../controllers/user-controllers'); // Fix variable name

const router = express.Router();

router.post('/register', userControllers.register);
router.get('/checkunique', userControllers.checkUnique);

module.exports = router;
