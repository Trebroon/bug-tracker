const express = require('express');
const catchAsync = require('../utils/catchAsync.js');
const { getUsersTickets } = require('../controllers/usersTickets');

const router = express.Router();

router.get('/', catchAsync(getUsersTickets));

module.exports = router;