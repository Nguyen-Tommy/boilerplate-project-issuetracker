'use strict';

const mongoose = require('mongoose');

module.exports = function (app) {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  const issueModel = require('../models/issue')

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      let obj = Object.assign(req.query);
      obj['project'] = project;

      issueModel.find(obj, (err, data) => {
        if (err)
          return console.log(err);
        else {
          let issues = [];
          data.forEach(data => {
            issues.push({
              _id: data._id,
              project: data.project,
              issue_title: data.issue_title,
              issue_text: data.issue_text,
              created_on: data.created_on,
              updated_on: data.updated_on,
              created_by: data.created_by,
              assigned_to: data.assigned_to,
              open: data.open,
              status_text: data.status_text
            });
          });
          return res.json(issues);
        }
      });
    })

    .post(function (req, res) {
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body

      if (!issue_title || !issue_text || !created_by)
        return res.json({ error: 'required field(s) missing' });

      let issue = new issueModel({
        project: project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text
      });

      issue.save((err, data) => {
        if (err)
          return console.log(err);
        else {
          let issue = {
            _id: data._id,
            issue_title: data.issue_title,
            issue_text: data.issue_text,
            created_on: data.created_on,
            updated_on: data.updated_on,
            created_by: data.created_by,
            assigned_to: data.assigned_to,
            open: data.open,
            status_text: data.status_text
          };
          return res.json(issue);
        }
      });
    })

    .put(function (req, res) {
      let issue = Object.assign(req.body);

      if (Object.keys(issue).length == 0)
        return res.json({ error: 'missing _id' });
      else if (Object.keys(issue).length === 1 && issue._id)
        return res.json({ error: 'no update field(s) sent', '_id': issue._id });
      else if (Object.keys(issue).length >= 2 && issue._id) {
        issue.updated_on = new Date();
        issueModel.findByIdAndUpdate(issue._id, issue, (err, data) => {
          if (err)
            return res.json({error: 'could not update', '_id': issue._id});
          return res.json({ result: 'successfully updated', '_id': issue._id });
        });
      }
    })

    .delete(function (req, res) {
      let issue = Object.assign(req.body);

      if (!issue._id)
        return res.json({ error: 'missing _id' });
      issueModel.findByIdAndDelete(issue._id, (err) => {
        if (err)
          return res.json({ error: 'could not delete', '_id': issue._id });
        return res.json({ result: 'successfully deleted', '_id': issue._id });
      });
    });
};
