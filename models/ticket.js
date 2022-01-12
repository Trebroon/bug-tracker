const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  type: {
    type: String,
    enum: ['Bug', 'Feature Request', 'Issue'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Worked On', 'Closed'],
    default: 'Open',
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;