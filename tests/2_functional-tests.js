const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
        .post('/api/issues/test_project')
        .send({
        issue_title: 'Test issue',
        issue_text: 'This is a test issue',
        created_by: 'Test User',
        assigned_to: 'Test Assignee',
        status_text: 'In Progress'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'status_text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.property(res.body, 'open');
            assert.property(res.body, '_id');
            done();
        })
   
  });

  test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
    .post('/api/issues/test_project')
    .send({
        issue_title: "Req. fields only",
        issue_text: "This is a test issue",
        created_by: "Test User"
    })
    .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'created_on');
        assert.property(res.body, '_id');
        done();
    });
  });

  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
    .post('/api/issues/test_project')
    .send({
        issue_title: "Missing required fields"
    })
    .end(function(err, res) {
        assert.equal(res.status, 400);
        done();
    })
  });

  test('View issues on a project: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
    .get('/api/issues/test_project')
    .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);

        res.body.forEach(function(issue) {
            assert.containsAllKeys(issue, ['issue_title', 'issue_text', 'created_by', 'created_on']);
        });
        done();
    })
  });

  test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
    .get('/api/issues/test_project')
    .query({
        issue_title: "Test issue"
    })
    .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], '_id');
        done();
    })
  });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
    .get('/api/issues/test_project')
    .query({
        issue_title: "Test issue",
        issue_text: "This is a test issue"
    })
    .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], '_id');
        done();
    })
  });

  test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
    .get('/api/issues/test_project')
    .end(function(err, res1) {
        let testID = res1.body[0]._id;
        chai.request(server)
        .put('/api/issues/test_project')
        .send({
            _id: testID,
            issue_title: "Updated test issue"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.property(res.body, '_id');
            done();
        })
    });
});

test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
    // Get the test issue ID
    chai.request(server)
    .get('/api/issues/test_project')
    .end(function(err, res1) {
        let testID = res1.body[0]._id;

        // Update the test issue with multiple fields
        chai.request(server)
        .put('/api/issues/test_project')
        .send({
            _id: testID,
            issue_title: "Updated test issue",
            issue_text: "This is an updated test issue",
            status_text: "In progress"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.property(res.body, '_id');
            done();
        })
    });
});


test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
    .put('/api/issues/test_project')
    .send({
        issue_title: "Updated test issue",
        issue_text: "This is an updated test issue",
        status_text: "In progress"
    })
    .end(function(err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.error, 'missing _id');
        done();
    })
});


test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
    // Get the test issue ID
    chai.request(server)
    .get('/api/issues/test_project')
    .end(function(err, res1) {
        let testID = res1.body[0]._id;

        // Update the test issue with no fields to update
        chai.request(server)
        .put('/api/issues/test_project')
        .send({
            _id: testID
        })
        .end(function(err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, 'no update field(s) sent');
            done();
        })
    });
});



test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
    .put('/api/issues/test_project')
    .send({
        _id: "invalid_id",
        issue_title: "Updated test issue"
    })
    .end(function(err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.error, 'could not update');
        done();
    })
});


test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
    .get('/api/issues/test_project')
    .end(function(err, res1) {
        let testIssueID = res1.body[0]._id;
        chai.request(server)
        .delete('/api/issues/test_project')
        .send({
            _id: testIssueID
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully deleted');
            assert.equal(res.body._id, testIssueID);
            done();
        })
    });
});


test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
    .delete('/api/issues/test_project')
    .send({
        _id: 'invalid_id'
    })
    .end(function(err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.error, 'could not delete');
        done();
    })
});


test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
    .delete('/api/issues/test_project')
    .end(function(err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.error, 'missing _id');
        done();
    })
});

});
