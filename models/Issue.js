const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const issueSchema = new Schema({
  project: String,
  issue_title: String,
  issue_text: String,
  created_on: {type: Date, default: new Date()},
  updated_on: {type: Date, default: new Date()},
  created_by: String,
  assigned_to: String,
  open: {type: Boolean, default: true},
  status_text: String
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;