const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Project = require('./project');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String,
    enum: ['Developer', 'Admin'],
    required: true,
  },
})

UserSchema.plugin(passportLocalMongoose)

UserSchema.virtual('userTickets', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: 'author'
});

UserSchema.virtual('userProjects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'assignedDevs',   // THIS IS NOT WORKING!!!
  justOne: false
})

UserSchema.post('findOneAndDelete', async function(doc) {
  if(doc) {
    await Project.updateMany({},
      { $pull: { assignedDevs: { $in: mongoose.Types.ObjectId(doc._id) }}})
  }
});

const User = mongoose.model('User', UserSchema)
module.exports = User;