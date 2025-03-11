const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { ObjectId } = require('mongodb');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let _id = "";
  const _invalid_id = 67383373635252622883;
  test('Create an issue with every field: POST request to /api/issues/{project}', function(done){
    chai
        .request(server)
        .post("/api/issues/:project")
        .send({
          issue_title: 'testing issue',
          issue_text: 'issue content',
          created_by: 'buchi_dev',
          assigned_to: 'buchi',
          status_text: 'pending'
        })
        .end((err, res) => {
            assert.equal(res.status, 201);
            assert.isObject(res.body);
            assert.property(res.body, 'issue_title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'status_text');
            assert.property(res.body, 'open');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.equal(res.body.issue_title, 'testing issue');
            assert.equal(res.body.issue_text, 'issue content');
            assert.equal(res.body.created_by, 'buchi_dev');
            assert.equal(res.body.assigned_to, 'buchi');
            assert.equal(res.body.status_text, 'pending');
            assert.isTrue(res.body.open);
            _id = res.body._id
            done();
        });
  });
  test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .post('/api/issues/:project')
      .send({
        issue_title: 'testing issue',
        issue_text: 'issue content',
        created_by: 'buchi_dev'
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, '_id');
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'status_text');
        assert.property(res.body, 'open');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.equal(res.status, 201)
        assert.equal(res.body.issue_title , 'testing issue');
        assert.equal(res.body.issue_text, 'issue content');
        assert.equal(res.body.created_by, 'buchi_dev');
        assert.equal(res.body.status_text, '');
        assert.equal(res.body.assigned_to, '');
        assert.isTrue(res.body.open);
        done();
      })
  })
  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .post('/api/issues/:project')
      .send({})
      .end((err, res) => {
        assert.isObject(res.body);
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      })
  });
  test('View issues on a project: GET request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .get('/api/issues/:project')
      .end((err, res) => {
        assert.isArray(res.body);
        assert.equal(res.status, 200);
        if (res.body.length > 0){
          res.body.forEach(issue => {
            assert.property(issue, 'issue_title');
            assert.property(issue, 'issue_text');
            assert.property(issue, '_id');
            assert.property(issue, 'created_by');
            assert.property(issue, 'created_on');
            assert.property(issue, 'assigned_to');
            assert.property(issue, 'status_text');
            assert.property(issue, 'open');
            assert.property(issue, 'updated_on');          
          });
        }
        done();
      })
  })
  test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .get('/api/issues/:project?created_by=buchi_dev')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        if (res.body.length > 0){
          res.body.forEach(issue => {
            assert.property(issue, 'created_by');
            assert.equal(issue.created_by, 'buchi_dev');
          })
        }
        done();
      })
  });
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .get('/api/issues/:project?status_text=pending&created_by=buchi_dev')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body)
        if (res.body.length > 0){
          res.body.forEach(issue => {
            assert.property(issue, 'status_text');
            assert.property(issue, 'created_by');
            assert.equal(issue.status_text, 'pending'); 
            assert.equal(issue.created_by, 'buchi_dev');
          })
        }
        done();
      })
  })
  test('Update one field on an issue: PUT request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .put('/api/issues/:project')
      .send({
        '_id': _id,
        'assigned_to': 'jude',
        'updated_on': new Date()
      })
      .end((err, res) => {
        assert.equal(res.status, 201);
        assert.isObject(res.body);
        assert.property(res.body, 'result');
        assert.property(res.body, '_id');
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, _id)
        done();
      })
  });
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .put('/api/issues/:project')
      .send({
        '_id': _id,
        'assigned_to': 'jude',
        'status_text': 'resolved',
        'open': false,
        'updated_on':new Date()
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.equal(res.status, 201);
        assert.property(res.body, 'result');
        assert.property(res.body, '_id');
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, _id);
        done();
      })
  });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .put('/api/issues/:project')
      .send({
        'open': false,
        'updated_on': new Date()
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .put('/api/issues/:project')
      .send({
        '_id': _id
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'no update field(s) sent');
        assert.property(res.body, '_id');
        assert.equal(res.body._id, _id);
        done();
      })
  })

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .put('/api/issues/:project')
      .send({
        '_id': _invalid_id,
        'open': 'false',
        'assigned_to': 'lukas',
        'updated_on': new Date()
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'could not update');   //maybe 'missing _id' error
        assert.property(res.body, '_id');
        done();
      })
  })
  
  test('Delete an issue: DELETE request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .delete('/api/issues/:project')
      .send({
        '_id': _id
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.equal(res.status, 200);
        assert.property(res.body, 'result');
        assert.property(res.body, '_id');
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, _id);
        done();
      })
  });

  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .delete('/api/issues/:project')
      .send({
        '_id': _invalid_id
      })
      .end((err, res) => {
        assert.equal(res.status, 201);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'could not delete');
        assert.property(res.body, '_id');
        done();
      })
  });

  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done){
    chai
      .request(server)
      .delete('/api/issues/:project')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 201);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'missing _id');
        done();
      })
  })
});
