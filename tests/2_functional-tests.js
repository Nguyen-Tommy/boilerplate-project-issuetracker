const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    this.timeout(5000);
    suite('Test Post request', function () {
        test('Create an issue with every field', function (done) {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    'issue_title': 1,
                    'issue_text': 1,
                    'created_by': 'Tommy',
                    'assigned_to': 'Nguyen',
                    'status_text': 'in QA'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 1);
                    assert.equal(res.body.issue_text, 1);
                    assert.equal(res.body.created_by, 'Tommy');
                    assert.equal(res.body.assigned_to, 'Nguyen');
                    assert.equal(res.body.status_text, 'in QA');
                    done();
                });
        });

        test('Create an issue with only required field', function (done) {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    'issue_title': 1,
                    'issue_text': 1,
                    'created_by': 'Tommy',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 1);
                    assert.equal(res.body.issue_text, 1);
                    assert.equal(res.body.created_by, 'Tommy');
                    done();
                });
        });

        test('Create an issue with only required field', function (done) {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    'issue_title': 1,
                    'issue_text': 1,
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'required field(s) missing');
                    done();
                });
        });
    });

    suite('Test Get request', function () {
        test('View issues on a project', function (done) {
            chai
                .request(server)
                .get('/api/issues/apitest')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body, 'is array');
                    assert.property(res.body[0], 'assigned_to');
                    assert.property(res.body[0], 'status_text');
                    assert.property(res.body[0], 'open');
                    assert.property(res.body[0], 'issue_title');
                    assert.property(res.body[0], 'issue_text');
                    assert.property(res.body[0], 'created_by');
                    assert.property(res.body[0], 'created_on');
                    assert.property(res.body[0], 'updated_on');
                    done();
                });
        });

        test('View issues on a project with one filter', done => {
            chai
                .request(server)
                .get('/api/issues/apitest?created_by=Tommy')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body, 'is array');
                    res.body.forEach(issue => {
                        assert.equal(issue.created_by, 'Tommy');
                    })
                    done();
                });
        });

        test('View issues on a project with multiple  filter', done => {
            chai
                .request(server)
                .get('/api/issues/apitest?open=true&created_by=Tommy')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body, 'is array');
                    res.body.forEach(issue => {
                        assert.equal(issue.open, true);
                        assert.equal(issue.created_by, 'Tommy');
                    })
                    done();
                });
        });
    });

    suite('Test Put request', function () {
        test('Update one field on an issue', function (done) {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: '638be39aae944fd646a27557', issue_title: '2' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { result: 'successfully updated', _id: '638be39aae944fd646a27557' });
                    done();
                });
        });

        test('Update multiple fields on an issue', function (done) {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: '638be39aae944fd646a27557', issue_title: '2', issue_title: '2' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { result: 'successfully updated', _id: '638be39aae944fd646a27557' });
                    done();
                });
        });

        test('Update an issue with missing _id', function (done) {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });

        test('Update an issue with no fields to update', done => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: '638be39aae944fd646a27557' })
                .end((err, res) => {
                    assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: '638be39aae944fd646a27557' });
                    done();
                });
        });

        test('Update an issue with an invalid _id', done => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: '1', issue_text: 'Tommy' })
                .end((err, res) => {
                    assert.deepEqual(res.body, { error: 'could not update', '_id': '1' });
                    done();
                });
        });
    });

    suite('Test Delete request', function () {
        test('Delete an issue', done => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({ _id: '638be39aae944fd646a27557' })
                .end((err, res) => {
                    assert.deepEqual(res.body, { result: 'successfully deleted', _id: '638be39aae944fd646a27557' });
                    done();
                });
        });

        test('Delete an issue with an invalid _id', done => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({ _id: '1' })
                .end((err, res) => {
                    assert.deepEqual(res.body, { error: 'could not delete', _id: '1' });
                    done();
                });
        });

        test('Delete an issue with missing _id', done => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({})
                .end((err, res) => {
                    assert.deepEqual(res.body, { error: 'missing _id' });
                    done();
                });
        });
    });
});
