'use strict';

const { ObjectId } = require("mongodb");
const { getDB } = require("../connection");

module.exports = function (app) {
  
  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text, _id, open, created_on, updated_on } = req.query
      let filterObj = {};

      if (issue_title) filterObj["issue_title"] = {$regex: issue_title, $options: "i"}
      if (issue_text) filterObj["issue_text"] = {$regex: issue_text, $options: "i"}
      if (created_by) filterObj["created_by"] = {$regex: created_by, $options: "i"}
      if (assigned_to) filterObj["assigned_to"] = {$regex: assigned_to, $options: "i"}
      if (status_text) filterObj["status_text"] = {$regex: status_text, $options: "i"}
      if (open) filterObj["open"] = JSON.parse(open)
      if (_id) filterObj["_id"] = new ObjectId(_id)
      if (created_on) filterObj["created_on"] = new Date(created_on)
      if (updated_on) filterObj["updated_on"] = new Date(updated_on)
      
      try {
        const db = await getDB();
        const issuesRes = await db.collection(project).find(filterObj).toArray();
        if(issuesRes.length == 0) return res.status(404).json("No issues in database");
        return res.status(200).json(issuesRes);
      } catch(err){
        res.status(500).json("server error");
      }
    })
    
    .post(async function (req, res){
      let project = req.params.project;

      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      
      if(!issue_title || !issue_text || !created_by){
        return res.status(200).json({ error: 'required field(s) missing' });
      };

      const newIssue = {
        assigned_to: assigned_to ? assigned_to : '',
        status_text: status_text ? status_text : '',
        "open":true,
        issue_title,
        issue_text,
        created_by,
        "created_on": new Date(),
        "updated_on": new Date()
      };
      try{
        const db = await getDB();
        const result = await db.collection(project).insertOne(newIssue);
        return res.status(201).json({_id:result.insertedId,...newIssue});
      } catch(err){
        res.status(200).json({ error: 'required field(s) missing' });
      }
    })
    
    .put(async function (req, res){
      let project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      const updateData = {}
      if(!_id) return res.status(200).json({ error: 'missing _id' });

      const issueId = new ObjectId(_id);
      if (issue_title) updateData["issue_title"] = { $regex: issue_title, $options: "i"} 
      if (issue_text) updateData["issue_text"] = { $regex: issue_text, $options: "i"}
      if (created_by) updateData["created_by"] = { $regex: created_by, $options: "i"}
      if (assigned_to) updateData["assigned_to"] = { $regex: assigned_to, $options: "i"}
      if (status_text) updateData["status_text"] = { $regex: status_text, $options: "i"}
      if (open) updateData["open"] = JSON.parse(open);
      updateData["updated_on"] = new Date();

      if(Object.keys(updateData).length === 1) return res.status(200).json({ error: 'no update field(s) sent', '_id': _id })
      try{
        const db = await getDB();
        const issueRes = await db.collection(project).updateOne({_id: issueId}, {$set: updateData});
        if (issueRes.modifiedCount == 0) return res.status(200).json({ error: 'could not update', '_id': _id })
        
        return res.status(201).json({  result: 'successfully updated', '_id': _id })
      } catch(err){
        return res.status(200).json({ error: 'could not update', '_id': _id });
      }
    })
    
    .delete(async function (req, res){
      let project = req.params.project;
      const {_id} = req.body;
      if (!_id) return res.status(201).json({ error: 'missing _id' })
      const issueId = new ObjectId(_id);
      try {
        const db = await getDB();
        const deleteRes = await db.collection(project).deleteOne({_id: issueId});
        if (deleteRes.deletedCount == 0) return res.status(201).json({ error: 'could not delete', '_id': _id })
        return res.status(200).json({ result: 'successfully deleted', '_id': _id })
      } catch(err){
        return res.status(201).json({ error: 'could not delete', '_id': _id });
      }
    });
    
};
