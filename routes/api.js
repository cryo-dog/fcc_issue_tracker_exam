'use strict';

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const IssuesSchema = require("../controllers/user_schema");



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
    issue_title ? searchObj.issue_title = issue_title : null;
    status_text ? searchObj.status_text = status_text : null;
    created_on ? searchObj.created_on = created_on : null;
    updated_on ? searchObj.updated_on = updated_on : null;
    open ? searchObj.open = open : null;

    if (!!queryParams) {
      try {
        //
        const issues = await issueModel.find();
        res.json(issues);
      } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
      }
    } else {
      //
      try {
        const issues = await issueModel.find(searchObj);
      } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
      }
    };
    
  })
  
  .post(async function (req, res){
    let project = req.params.project;
    const issueModel = req.issueModel;
    let { assigned_to, created_by, issue_text, issue_title, status_text, _id, open, updated_on, created_on} = req.body;

    if (!issue_title || !issue_text || !created_by) {
      res.status(400).json({ error: 'required field(s) missing' });
      return;
    }

    open != "false" ? open = true : open = false;

    // New object with fields only for where there is a value in the object
    const updateValues = {};
    updateValues.assigned_to = (assigned_to) ? assigned_to : '';
    updateValues.created_by = (created_by) ? created_by : '';
    updateValues.issue_text = (issue_text) ? issue_text : '';
    updateValues.issue_title = (issue_title) ? issue_title : '';
    updateValues.status_text = (status_text) ? status_text : '';
    updateValues.created_on = (created_on) ? created_on : '';    
    updateValues.updated_on = updated_on ? updated_on : new Date();
    updateValues.open = open;

    const newIssue = new issueModel(updateValues);
    try {
      const newIssueResp = await newIssue.save();
      res.status(200).json(newIssueResp);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
    
  })
  
  .put(async function (req, res){

    let project = req.params.project;
    const issueModel = req.issueModel;
    let { assigned_to, created_by, issue_text, issue_title, status_text, _id, open  } = req.body;
    open != "false" ? open = true : open = false;

    if (!_id) {
          res.status(400).json({ error: 'missing _id' });
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
          res.status(400).json({ error: 'no update field(s) sent', _id: _id });
          return;
        };

    updateValues.updated_on = new Date();
    updateValues.open = open;

    try {
      const updatedEntry = await issueModel.findOneAndUpdate({ _id: _id }, updateValues, { new: true });
      console.log(updatedEntry);
      res.status(200).json({result: "successfully updated", _id: _id});
    } catch (error) {
      res.status(400).json({error: "could not update", _id: _id});
      console.error("Error updating", error);
    }
  })
  
  .delete(async function (req, res){
    let project = req.params.project;
    const issueModel = req.issueModel;
    const _id = req.body._id;
    
    if (!_id) {
      res.status(400).json({ error: "missing _id" });
      return;
    };
    try {
      const deletedEntry = await issueModel.findOneAndDelete({ _id: _id });
      console.log(deletedEntry);
      res.status(200).json({result: "successfully deleted", _id: _id});
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'could not delete' });
    };
  });

module.exports = router;