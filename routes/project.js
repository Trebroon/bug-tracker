const express = require('express');
const catchAsync = require('../utils/catchAsync.js');
const project = require('../controllers/projects.js');
const ticket = require('../controllers/ticket.js');
const comment = require('../controllers/comments.js');
const { validateTicket, validateComment, isLoggedIn, canManageProjectDevs, canAccessProject, canManageProject } = require('../middleware.js');

const router = express.Router();

router
  .route('/:id')
  .get(isLoggedIn, catchAsync(canAccessProject), catchAsync(project.getProject))
  .patch(isLoggedIn, canManageProjectDevs, catchAsync(project.addTeamMember))
  .delete(isLoggedIn, canManageProject, catchAsync(project.deleteProject));

router
  .route('/:id/newTicket')
  .get(isLoggedIn, catchAsync(ticket.getNewTicket))
  .post(isLoggedIn, validateTicket, catchAsync(ticket.createTicket))

router
  .route('/:id/comment')
  .post(isLoggedIn, validateComment, catchAsync(comment.addComment));

router
  .route('/:id/:userId/remove')
  .patch(isLoggedIn, canManageProjectDevs, catchAsync(project.removeTeamMember));
  
router
  .route('/:id/ticket/:ticketId')
  .get(isLoggedIn, catchAsync(ticket.getEditTicket))
  .post(isLoggedIn, validateTicket, catchAsync(ticket.editTicket))
  .delete(isLoggedIn, catchAsync(ticket.deleteTicket));
  
module.exports = router;