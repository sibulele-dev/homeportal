const express = require('express');
const router = express.Router();
const {User} = require('../models/users')
const {register}= require('../middleware/auth')

router.route("/signup").post(register)


module.exports = router