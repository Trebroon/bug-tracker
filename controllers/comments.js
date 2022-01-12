const Project = require('../models/project.js');
const Comment = require('../models/comment.js');

// adding new comment to project
module.exports.addComment = async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id);
  const comment = await new Comment(req.body.comment)
  comment.author = req.user._id;
  comment.project = project._id;
  project.comments.push(comment);
  comment.save();
  project.save();
  res.redirect(`/project/${id}`);
}