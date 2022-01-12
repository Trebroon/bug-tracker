const { projectSchema, ticketSchema, commentSchema } = require('./schemas');
const Project = require('./models/project');
const ExpressError = require('./utils/ExpressError');

// is user logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
      req.flash('error', 'You must be signed in');
      return res.redirect('/users/login');
  }
  next();
};

// can user create and delete projects
module.exports.canManageProject = (req, res, next) => {
  if (req.user.userType !== 'Admin') {
    req.flash('error', 'You don\'t have a permission to do that.');
    return res.redirect('/');
  }
  next();
}

// can user create, delete and edit users
module.exports.canManageDevs = (req, res, next) => {
  if (req.user.userType !== 'Admin') {
    req.flash('error', 'You don\'t have a permission to do that.');
    return res.redirect('/users');
  }
  next();
}

// can user access project
module.exports.canAccessProject = async (req, res, next) => {
    const project = await Project.findById(req.params.id);
    let count = 0;
    for (let i = 0; i < project.assignedDevs.length; i++) {
      if (project.assignedDevs[i]._id.equals(req.user._id)) {
        count += 1;
      }
    }
    if (count === 0) {
      req.flash('error', 'You don\'t have access to this project.');
      return res.redirect('/');
    }
    next();
};

// can user manage developers in project
module.exports.canManageProjectDevs = (req, res, next) => {
  if (req.user.userType !== 'Admin') {
    req.flash('error', 'You don\'t have a permission to do that.')
    return res.redirect(`/${req.params.id}`)
  }
  next();
};

// is project valid
module.exports.validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateTicket = (req, res, next) => {
  const { error } = ticketSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}