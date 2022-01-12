const User = require('../models/user.js');

// render login page
module.exports.renderLogin = (req, res, next) => {
  res.render('users/login');
};

// login user 
module.exports.login = (req, res, next) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/');
};

// logout user 
module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/users/login');
};

// render page of all users 
module.exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  const user = await User.findById(req.user._id);
  res.status(200).render('users/usersPage', { users, user });
};

// render edit user page
module.exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.redirect('/users');
  }
  res.render('users/editUser', { user });
};

// creating new user
module.exports.createUser = async (req, res, next) => {
  const { phone, email, userType, username, password } = req.body.user;
  const user = new User({ phone, email, userType, username});
  const regUser = await User.register(user, password);
  res.redirect('/users');
};

// editing user
module.exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { ...req.body.user, });
  await user.save();
  res.redirect('/users');
};

// deleting user 
module.exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/users');
};