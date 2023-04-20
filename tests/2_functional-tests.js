const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
    let test_data = {
        issue_title: 'Faux Issue Title',
        issue_text: 'Functional Test - Every field filled in',
        created_by: 'fCC',
        assigned_to: 'Chai and Mocha'
    }
    chai.request(server)
        .post('/api/issues/test_project')
        .send(test_data)
        .end(function(err, res) {
            let data = res.body;
         //   assert.equal(res.status, 200);
            assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'status_text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.property(res.body, 'open');
            assert.property(res.body, '_id');

            assert.isObject(data);
            assert.nestedInclude(data, test_data);
            assert.property(data, 'created_on');
            assert.isNumber(Date.parse(data.created_on));
            assert.property(data, 'updated_on');
            assert.isNumber(Date.parse(data.updated_on));
            assert.property(data, 'open');
            assert.isBoolean(data.open);
            assert.isTrue(data.open);
            assert.property(data, '_id');
            assert.isNotEmpty(data._id);
            assert.property(data, 'status_text');
            assert.isEmpty(data.status_text);


            done();
        })
   
  });

  test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
    let test_data = {
        issue_title: 'Faux Issue Title',
        issue_text: 'Functional Test - Required Fields Only',
        created_by: 'fCC'
      };
    chai.request(server)
    .post('/api/issues/test_project')
    .send(test_data)
    .end(function(err, res) {
        const data = res.body;
      //  assert.equal(res.status, 200);
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'created_on');
        assert.property(res.body, '_id');
        assert.isObject(data);
        assert.nestedInclude(data, test_data);
        done();
    });
  });

  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
    let test_data = { created_by: 'fCC' };
    chai.request(server)
    .post('/api/issues/test_project')
    .send(test_data)
    .end(function(err, res) {
        const data = res.body;

        assert.isObject(res.body);
       // assert.equal(res.status, 400);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'required field(s) missing');
        assert.isObject(data);
        assert.property(data, 'error');
        assert.equal(data.error, 'required field(s) missing');
        done();
    })
  });

  test('View issues on a project: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
    .get('/api/issues/test_project')
    .end(function(err, res) {
     //   assert.equal(res.status, 200);
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
        issue_title: "Faux Issue Title"
    })
    .end(function(err, res) {
     //   assert.equal(res.status, 200);
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
        issue_title: "Faux Issue Title",
        created_by: "fCC"
    })
    .end(function(err, res) {
     //   assert.equal(res.status, 200);
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
     //       assert.equal(res.status, 200);
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
      //      assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.property(res.body, '_id');
            done();
        })
    });
});


test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
    .put('/api/issues/test_project')
    .send()
    .end(function(err, res) {
        let badUpdate = res.body;
   //     assert.equal(res.status, 400);
        assert.equal(res.body.error, 'missing _id');
        assert.isObject(badUpdate);
        assert.property(badUpdate, 'error');
        assert.equal(badUpdate.error, 'missing _id');
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
   //         assert.equal(res.status, 400);
            assert.equal(res.body.error, 'no update field(s) sent');
            assert.equal(res.body._id, testID);
            
            let badID = "bad_id";
            chai.request(server)
            .put('/api/issues/test_project')
            .send({
                _id: badID,
                issue_title: "bad test issue"
            })
            .end(function(err, res) {
              assert.equal(res.body.error, 'could not update');
              assert.equal(res.body._id, badID);  
              done();
            })
        })
    });
});



test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
    .put('/api/issues/test_project')
    .send({
        _id: "5f665eb46e296f6b9b6a50xd",
        issue_title: "Updated test issue"
    })
    .end(function(err, res) {
    //    assert.equal(res.status, 400);
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id, '5f665eb46e296f6b9b6a50xd');
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
    //        assert.equal(res.status, 200);
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
        _id: '5f665eb46e296f6b9b6a50xd'
    })
    .end(function(err, res) {
    //    assert.equal(res.status, 400);
        assert.equal(res.body.error, 'could not delete');
        done();
    })
});


test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
    .delete('/api/issues/test_project')
    .end(function(err, res) {
    //    assert.equal(res.status, 400);
        assert.equal(res.body.error, 'missing _id');
        done();
    })
});

});
