// ********************** Initialize server **********************************

//importing server and db for testing
const {db, server, app} = require('../src/index');
// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;
const bcrypt = require('bcryptjs'); //  To hash passwords

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Lab 11 Server Test', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
}); 

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// *******  Testing /register API  *******
// Positive Testcase :
// API: /register
// Input: {{username: 'cama', password: 'cama'}
// Expect: res.status == 200
// Result: This test case should pass and return a status 200.
// Explanation: The testcase will call the /register API with the following input
// and expects the API to return a status of 200.

// Negative Testcase :
// API: /register
// Input: {{username: ''aabbccddennnnnnwjfnwjfwjfbwljfbj2qbrqjwbwqobfqofbwfbwqjbfwefwwfw', password: 'cama'}
// Expect: res.status == 400
// Result: This test case should fail and return a status 400.
// Explanation: The testcase will call the /register API with the following input
// and expects the API to return a status of 400.

describe('Testing /register API', () => {
    it('positive : /register', done => {
      chai
        .request(server)
        .post('/register')
        .send({username: 'cama', password: 'cama'})
        .end((err, res) => {
          expect(res).to.have.status(200);
          //expect(res.body.message).to.equals('success');
          done();
        });
    });
    it('negative : /register. checking invalid username', done => {
      chai
        .request(server)
        .post('/register')
        .send({username: 'aabbccddennnnnnwjfnwjfwjfbwljfbj2qbrqjwbwqobfqofbwfbwqjbfwefwwfw', password: 'cama'})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equals('Username Exceeds Character Limit');
          done();
        });
    });
  });


// *******  Testing /addReview API  *******
// Positive Testcase :
// API: /addReview
// Input: 
// Expect: res.status == 200
// Result: This test case should pass and return a status 200.
// Explanation: The testcase will call the /addReview API after creating a session using testUser. Since
// there is a session, the API should allow a review to be added

// Negative Testcase :
// API: /addReview
// Input: 
// Expect: res.status == 200
// Result: This test case should pass and return a status 200.
// Explanation: The testcase will call the /addReview API but now create a session. Since there is 
// no session, the API should rediect to /login

describe('Testing /addReview API', () => {
  let agent;
  const testUser = {
    username: 'testuser',
    password: 'testpass123',
  };
  
  before(async () => {
    // Clear users table and create test user
    await db.query('TRUNCATE TABLE users CASCADE');
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
      testUser.username,
      hashedPassword,
    ]);
  });
  
  beforeEach(() => {
    // Create new agent for session handling
    agent = chai.request.agent(app);
  });
  
  afterEach(() => {
      // Clear cookie after each test
    agent.close();
  });
  
  after(async () => {
    // Clean up database
    await db.query('TRUNCATE TABLE users CASCADE');
  });
  
  it('should add a review successfully', async () => {
    // Login first to get the session
    const loginTest = await agent.post('/login').send(testUser);
    console.log('Attempting to login using testUser .... ' + loginTest.status);
      
    // review data
    const reviewData = {
      review: 'Great event!',
      rating: 5,
      section: 232,
      row: 1,
      seatNumber: 20,
      eventName: 'zach bryan',
      image_url: 'http://example.com/image.jpg',
      image_caption: 'test image',
    };
  
    // Send POST request to /addReview
    const res = await agent.post('/addReview').send(reviewData);
  
    // expect 200 status 
    expect(res).to.have.status(200);
    expect(res.body.status).to.equals('success');
    expect(res.body.message).to.equals('data added successfully');
  });
  
  it('should fail to add a review if not authenticated', async () => {
    // Attempt to add a review without logging in
    const reviewData = {
      review: 'Great event!',
      rating: 5,
      section: 232,
      row: 1,
      seatNumber: 20,
      eventName: 'zach bryan',
    };
      
    // Send POST request to /addReview
    const res = await chai.request(app).post('/addReview').send(reviewData);
    // Expect redirect to /login and 200 status
    expect(res).to.have.status(200); 
    expect(res).to.redirect;
  });
}); 
  