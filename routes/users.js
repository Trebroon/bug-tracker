const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync.js');
const user = require('../controllers/users.js');
const { isLoggedIn, canManageDevs } = require('../middleware');

const router = express.Router();

router
  .route('/')
  .get(isLoggedIn, catchAsync(user.getUsers))
  .post(isLoggedIn, canManageDevs, catchAsync(user.createUser));

router
  .route('/login')
  .get(user.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/users/login',
    }),
    user.login,
  );

router.get('/logout', user.logout);

router 
  .route('/user/:id')
  .get(isLoggedIn, canManageDevs, catchAsync(user.getUser))
  .put(isLoggedIn, canManageDevs, catchAsync(user.updateUser))
  .delete(isLoggedIn, canManageDevs, catchAsync(user.deleteUser));


module.exports = router;