const express = require('express');
const catchAsync = require('../utils/catchAsync.js');
const project = require('../controllers/projects.js');
const { validateProject, isLoggedIn, canManageProject } = require('../middleware.js');

const router = express.Router();

router
  .route('/')
  .get(isLoggedIn, catchAsync(project.getProjects))
  .post(isLoggedIn, canManageProject, validateProject, catchAsync(project.createProject));
  
module.exports = router;
