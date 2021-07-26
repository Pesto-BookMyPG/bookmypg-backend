const { chai, server, should } = require('./testConfig');
const userModel = require('../models/userModel');

/**
 * Test cases to test all the book APIs
 * Covered Routes:
 * (1) Login
 * (2) Store user
 * (3) Get all users
 * (4) Get single user
 */

describe('User', () => {
  //Before each test we empty the database
  before(done => {
    userModel.deleteMany({}, err => {
      done();
    });
  });

  // Prepare data for testing
  const userTestData = {
    token: '',
  };

  // Prepare data for testing
  const testData = {
    firstName: 'testinguserfirstname',
    lastName: 'testinguserlastname',
    email: 'abc@gmail.com',
  };

  /*
   * Test the /POST route
   */
  describe('/POST User Store', () => {
    it('It should send validation error for store user', done => {
      chai
        .request(server)
        .post('/api/user')
        .send()
        //.set("Authorization", "Bearer "+ userTestData.token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST User Store', () => {
    it('It should store user', done => {
      chai
        .request(server)
        .post('/api/user')
        .send(testData)
        //.set("Authorization", "Bearer "+ userTestData.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('User add Success.');
          userTestData.token = res.body.data.token;
          done();
        });
    });
  });

  /*
   * Test the /GET route
   */
  describe('/GET All users', () => {
    it('it should GET all the users', done => {
      chai
        .request(server)
        .get('/api/user')
        .set('x-auth-token', userTestData.token)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Operation success');
          testData._id = res.body.data[0]._id;
          done();
        });
    });
  });

  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id user', () => {
    it('it should GET the users', done => {
      chai
        .request(server)
        .get('/api/user/' + testData._id)
        .set('x-auth-token', userTestData.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Operation success');
          done();
        });
    });
  });
});
