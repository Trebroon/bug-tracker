const mongoose = require('mongoose');
const Project = require('../models/project.js');
const User = require('../models/user.js');
const Ticket = require('../models/ticket.js');

// rendering page for creating ticket
module.exports.getNewTicket = async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  const user = await User.findById(req.user._id);
  res.render('./tickets/newTicket', { project, user });
}

// rendering page for editing ticket
module.exports.getEditTicket = async (req, res, next) => {
  const { id, ticketId } = req.params;
  const project = await Project.findById(id);
  const ticket = await Ticket.findById(ticketId);
  const user = await User.findById(req.user._id);
  res.render('./tickets/editTicket', { project, ticket, user });
}

// creating new ticket for project
module.exports.createTicket = async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  const user = await User.findById(req.user._id);
  const ticket = new Ticket(req.body.ticket);
  ticket.author = user._id;
  ticket.projectId = project._id;
  project.projectTickets.push(ticket._id);
  await ticket.save();
  await project.save();
  res.redirect(`/project/${req.params.id}`);
}

// editing ticket
module.exports.editTicket = async (req, res, next) => {
  const { id, ticketId } = req.params;
  const ticket = await Ticket.findByIdAndUpdate(ticketId, { ...req.body.ticket});
  await ticket.save();
  res.redirect(`/project/${id}`);
}

// deleting ticket from project 
module.exports.deleteTicket = async (req, res, next) => {
  const { id, ticketId } = req.params;
  await Project.findByIdAndUpdate(id, {
    $pull: { projectTickets: ticketId },
  });
  await Ticket.findByIdAndDelete(ticketId); 
  res.redirect(`/project/${id}`);
}