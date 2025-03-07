'use strict';

module.exports = function (app) {

  // res  json: {"assigned_to":"buchdev","status_text":"pending","open":true,"_id":"67caa6fec899b20013513057","issue_title":"functional tests not working","issue_text":"functional tests not working","created_by":"buchi","created_on":"2025-03-07T07:57:50.015Z","updated_on":"2025-03-07T07:57:50.015Z"}
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      console.log(req.params)
      return res.send("tracking")
    })
    
    .post(function (req, res){
      let project = req.params.project;
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
