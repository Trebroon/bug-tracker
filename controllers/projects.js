const mongoose = require('mongoose');
const moment = require('moment');
const Project = require('../models/project.js');
const User = require('../models/user.js');
const Comment = require('../models/comment.js');

// rendering project page
module.exports.getProject = async (req, res) => {
  const { id } = req.params;
  const users = await User.find({});
  const user = await User.findById(req.user._id);
  const comments = await Comment.find({});
  const project = await Project.findById(id)
    .populate('assignedDevs')
    .populate('projectTickets')
    .populate({
      path: 'comments',
      populate: { path: 'author',
                  model: 'User' }
    });
  res.render('projects/projectPage', { project, users, comments, moment, user });
};

// rendering index page
module.exports.getProjects = async (req, res) => {
  const users = await User.find({});
  const user = await User.findById(req.user._id)
    .populate('userProjects');
  const projects = await Project.find({});
  res.status(200).render('projects/index', { projects, users, user });
}

// creating new project 
module.exports.createProject = async (req, res) => {
  const project = new Project(req.body.project);
  await project.save();
  res.status(200).redirect('/');
}

// deleting project
module.exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndDelete(id);
  res.redirect('/');
}

// assigning developer to project 
module.exports.addTeamMember = async (req, res, next) => {
  const { id } = req.params;
  const { dev } = req.body;
  const project = await Project.findByIdAndUpdate(id);
  const user = await User.findById(dev);
  project.assignedDevs.addToSet(user);
  await project.save();
  res.redirect(`/project/${id}`);
}

// removing developer from project
module.exports.removeTeamMember = async (req, res, next) => {
  const { id, userId } = req.params; 
  const project = await Project.findByIdAndUpdate(id);
  await project.assignedDevs.pull(userId);
  await project.save();
  res.redirect(`/project/${id}`);
}