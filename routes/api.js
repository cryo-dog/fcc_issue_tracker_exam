'use strict';

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.route('/issues/:project')
  
  .get(async function (req, res){
    let project = req.params.project;
    const queryParams = req.query;
    let { assigned_to, created_by, issue_text, issue_title, status_text, _id, open, created_on, updated_on } = queryParams;
    const issueModel = req.issueModel;

    let searchObj = {};
    assigned_to ? searchObj.assigned_to = assigned_to : null;
    created_by ? searchObj.created_by = created_by : null;
    issue_text ? searchObj.issue_text = issue_text : null;
    issue_text ? searchObj.issue_text = issue_text : null;
    _id ? searchObj._id = _id : null;
    status_text ? searchObj.status_text = status_text : null;
    created_on ? searchObj.created_on = created_on : null;
    updated_on ? searchObj.updated_on = updated_on : null;
    open ? searchObj.open = open : null;

    if (Object.keys(searchObj).length === 0) {
      try {
        //
        const issues = await issueModel.find();
        res.json(issues);
      } catch (err) {
        console.error(err);
        res.status(200).json({ message: err.message });
      }
    } else {
      //
      try {
        const issues = await issueModel.find(searchObj);
        res.json(issues);
      } catch (err) {
        console.error(err);
        res.status(200).json({ message: err.message });
      }
    };
    
  })
  
  .post(async function (req, res){
    let project = req.params.project;
    const issueModel = req.issueModel;
    let { assigned_to, created_by, issue_text, issue_title, status_text, _id, open, updated_on, created_on} = req.body;

    if (!issue_title || !issue_text || !created_by) {
      res.json({ error: 'required field(s) missing' });
      console.log("res:----------");
      console.log(res.body);
      return;
    }

    open != "false" ? open = true : open = false;

    // New object with fields only for where there is a value in the object
    const updateValues = {}; /*
    updateValues.assigned_to = (assigned_to) ? assigned_to : '';
    updateValues.created_by = (created_by) ? created_by : '';
    updateValues.issue_text = (issue_text) ? issue_text : '';
    updateValues.issue_title = (issue_title) ? issue_title : '';
    updateValues.status_text = (status_text) ? status_text : '';
    updateValues.updated_on = updated_on ? updated_on : "";
    */
    if (assigned_to) updateValues.assigned_to = assigned_to;
    if (created_by) updateValues.created_by = created_by;
    if (issue_text) updateValues.issue_text = issue_text;
    if (issue_title) updateValues.issue_title = issue_title;
    if (status_text) updateValues.status_text = status_text;

    const newIssue = new issueModel(updateValues);
    console.log(newIssue);
    try {
      const newIssueResp = await newIssue.save();
      res.status(200).json(newIssueResp);
    } catch (err) {
      console.error(err);
      res.json({ error: "something's not working..." });
    }
    
  })
  
  .put(async function (req, res){

    let project = req.params.project;
    const issueModel = req.issueModel;
    let { assigned_to, created_by, issue_text, issue_title, status_text, _id, open  } = req.body;

    console.log(`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    Varaibles are _id: ${_id}, assgined to: ${assigned_to}, created_by: ${created_by}, 
    issue_text: ${issue_text}, issue_title: ${issue_title}, status_text: ${status_text}, open: ${open}
    xxxxxxxxxxxxxx`);

    if (open == "false") {
      open = false;
    } else {
        open = true;
      };

    if (!_id) {
          res.json({ error: 'missing _id' });
          return;
        };


    // New object with fields only for where there is a value in the object
    const updateValues = {};
    if (assigned_to) updateValues.assigned_to = assigned_to;
    if (created_by) updateValues.created_by = created_by;
    if (issue_text) updateValues.issue_text = issue_text;
    if (issue_title) updateValues.issue_title = issue_title;
    if (status_text) updateValues.status_text = status_text;

    if (Object.keys(updateValues).length === 0) {
          res.json({ error: "no update field(s) sent", "_id": _id});
          console.log("_id: ", _id, "error: ", "no update field(s) sent");
          return;
        };
    
    if (_id) updateValues._id = _id;
    updateValues.updated_on = new Date();
    updateValues.open = open;

    try {
      const updatedEntry = await issueModel.findOneAndUpdate({ "_id": _id }, updateValues, { new: true });
      console.log(updatedEntry);
      res.status(200).json({result: "successfully updated", "_id": _id});
    } catch (error) {
      res.json({error: "could not update", "_id": _id});
      console.error("Error updating, id does not exist or server down");
    }
  })
  
  .delete(async function (req, res){
    let project = req.params.project;
    const issueModel = req.issueModel;
    const _id = req.body._id;
    
    if (!_id) {
      res.json({ error: "missing _id" });
      return;
    };
    try {
      const deletedEntry = await issueModel.findOneAndDelete({ "_id": _id });
      console.log(deletedEntry);
      res.status(200).json({result: "successfully deleted", _id: _id});
    } catch (err) {
      console.error("could not delete");
      res.json({ error: 'could not delete' });
    };
  });

module.exports = router;