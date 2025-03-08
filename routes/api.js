'use strict';

const { getDB } = require("../connection");

module.exports = function (app) {

  // res  json: {"assigned_to":"buchdev","status_text":"pending","open":true,"_id":"67caa6fec899b20013513057","issue_title":"functional tests not working","issue_text":"functional tests not working","created_by":"buchi","created_on":"2025-03-07T07:57:50.015Z","updated_on":"2025-03-07T07:57:50.015Z"}
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      console.log(req.params)
      return res.send("tracking")
    })
    
    .post(async function (req, res){
      let project = req.params.project;

      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const assigned_to = req.body.assigned_to || '';
      const status_text = req.body.status_text || '';
      const created_by = req.body.created_by;

      if(!issue_title || !issue_text || !created_by){
        return res.status(400).json({ error: 'required field(s) missing' });
      }

      const newIssue = {
        assigned_to,
        status_text,
        "open":true,
        issue_title,
        issue_text,
        created_by,
        "created_on": new Date(),
        "updated_on": new Date()
      };
      try{
        const db = getDB();
        const result = await db.collection("issues").insertOne(newIssue);
        return res.status(201).json({_id:result.insertedId,...newIssue});
      } catch(err){
        res.status(500).json({'error':'server error'})
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
