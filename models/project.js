const mongoose = require('mongoose');
const Comment = require('./comment');
const Ticket = require('./ticket');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema ({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedDevs: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
  projectTickets: {
    type: [Schema.Types.ObjectId],
    ref: 'Ticket',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment',
  },
});


ProjectSchema.post('findOneAndDelete', async function(doc) {
  if(doc) {
    await Comment.deleteMany({
      _id: {
        $in: doc.comments
      }
    });
    await Ticket.deleteMany({
      _id: {
        $in: doc.projectTickets
      }
    });
  }
});

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;