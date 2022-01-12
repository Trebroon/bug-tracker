const User = require('../models/user.js');

module.exports.getUsersTickets = async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId)
    .populate('userTickets')
  res.status(200).render('users/usersTickets', { user });
};

