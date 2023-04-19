'use strict';

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Issues = require("../controllers/user_schema");


router.route('/issues/:project')
  
  .get(async function (req, res){
    let project = req.params.project;
    console.log("We are in the get route");
    try {
      //
      const issues = await Issues.find();
      res.json(issues);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
    
  })
  
  .post(async function (req, res){
    let project = req.params.project;
    const { assigned_to, created_by, issue_text, issue_title, status_text } = req.body;

    const newIssue = new Issues({
      issue_title: issue_title,
      issue_text: issue_text,
      created_by: created_by
    });
    try {
      const newIssueResp = await newIssue.save();
      res.status(200).json(newIssueResp);
    } catch (error) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
    
  })
  
  .put(async function (req, res){

    let project = req.params.project;
    let { assigned_to, created_by, issue_text, issue_title, status_text, _id, open  } = req.body;
    open != "false" ? open = true : open = false;

    // New object with fields only for where there is a value in the object
    const updateValues = {};
    if (assigned_to) updateValues.assigned_to = assigned_to;
    if (created_by) updateValues.created_by = created_by;
    if (issue_text) updateValues.issue_text = issue_text;
    if (issue_title) updateValues.issue_title = issue_title;
    if (status_text) updateValues.status_text = status_text;
    updateValues.open = open;

    try {
      const updatedEntry = // please fix
    } catch (error) {
      console.error("Error updating", err);
    }

  })
  
  .delete(function (req, res){
    let project = req.params.project;
    
  });

module.exports = router;