/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const Issue = require("../models/Issue");

function checkIfAllFalse(...args) {
  let count = 0;
  args.forEach(formEntry => {
    if (!formEntry) {
      count++;
    }
  });
  if (count === args.length) {
    return true;
  } else {
    return false;
  }
}

function returnFormValuesToUpdate(arr) {
  let updateObject = { updated_on: new Date() };
  arr.forEach(formEntryObj => {
    // Extract variable name from function argument
    let formName = Object.keys(formEntryObj)[0];
    if (formEntryObj[formName]) {
      updateObject[formName] = formEntryObj[formName];
    }
  });
  return updateObject;
}

function returnQueryValuesToDisplay(project, arr) {
  let updateObject = { project };
  arr.forEach(formEntryObj => {
    // Extract variable name from function argument
    let formName = Object.keys(formEntryObj)[0];
    if (formEntryObj[formName]) {
      updateObject[formName] = formEntryObj[formName];
    }
  });
  return updateObject;
}

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      var project = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.query;

      Issue.find(
        returnQueryValuesToDisplay(project, [
          { _id },
          { issue_title },
          { issue_text },
          { created_by },
          { assigned_to },
          { status_text },
          { open }
        ]),
        function(err, data) {
          if (err || !data) {
            res.status(404).send("No issues found");
          } else {
            res.json(data);
          }
        }
      );
    })

    .post(function(req, res) {
      const project = req.params.project;

      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;
    
      if ( !issue_title || !issue_text || !created_by ){
        res.status(400).send("Please enter all required fields");
      }

      const issue = new Issue({
        project,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      });
      
      issue.save(function(err, item) {
        if (err) {
          res.status(500).send("Failed to create issue");
        } else {
          let {
            project,
            issue_title,
            issue_text,
            created_on,
            updated_on,
            created_by,
            assigned_to,
            open,
            status_text,
            _id
          } = item;

          res.json({
            project,
            issue_title,
            issue_text,
            created_on,
            updated_on,
            created_by,
            assigned_to,
            open,
            status_text,
            _id
          });
        }
      });
    })

    .put(function(req, res) {
      var project = req.params.project;

      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.body;

      // Check if correct fields have been entered
      if (
        !_id ||
        checkIfAllFalse(
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open
        )
      ) {
        res.status(400).send("No Updated Field Sent");
      } else {
        Issue.findByIdAndUpdate(
          { _id },
          returnFormValuesToUpdate([
            { issue_title },
            { issue_text },
            { created_by },
            { assigned_to },
            { status_text },
            { open }
          ]),
          { new: true },
          function(err, issue) {
            if (err || !issue) {
              res.status(500).send("Could not update " + _id);
            } else {
              res.send("Successfully Updated");
            }
          }
        );
      }
    })

    .delete(function(req, res) {
      var project = req.params.project;
      const { _id } = req.body;
      if (!_id) {
        res.status(400).send("_id error");
      } else {
        Issue.findByIdAndRemove({ _id }, function(err, deletedIssue) {
          if (err || !deletedIssue) {
            res.status(500).send("Failed: Could not delete _id:" + _id);
          } else {
            res.send("Success: Deleted _id:" + _id);
          }
        });      
      }
    });
};
