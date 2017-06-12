process.env.NODE_ENV = 'test';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import server from '../../src/server.js';
import User from '../../src/models/user.js';

chai.use(chaiHttp);

describe('API Routes: create an user (POST /api/v1/sign_up)', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ('should create or sign_up an user with valid data', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'test@gmail.com', password: 'password'})
      .end((err, res) => {
        expect(res.status).to.be.equal(200)
        expect(res.body).to.have.property('id');
        expect(res.body).to.be.have.property('auth_token');
        done();
      });
  });

  it ('should not create or sign_up an user with empty email', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({password: 'password'})
      .end((err, res) => {
        expect(res.status).to.be.equal(400)
        expect(res.body).to.have.property('email');
        expect(res.body.email).to.be.equal('Email must be present');
        done();
      });
  });

  it ('should not create or sign_up an user with empty password', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'email@gmail.com'})
      .end((err, res) => {
        expect(res.status).to.be.equal(400)
        expect(res.body).to.have.property('password');
        expect(res.body.password).to.be.equal('Password must be present');
        done();
      });
  });

  it ('should sign_in an user with valid credentials', (done) => {
    let user = new User({email: 'abc@gmail.com', password: 'password'});
    user.save((err, user) => {
      chai.request(server)
        .post('/api/v1/sign_in')
        .set('Content-Type', 'application/json')
        .send({email: 'abc@gmail.com', password: 'password'})
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('auth_token');
          done();
        });
    });
  });

  it ('should not sign_in an user with invalid credentials', (done) => {
    let user = new User({email: 'abc@gmail.com', password: 'password'});
    user.save((err, user) => {
      chai.request(server)
        .post('/api/v1/sign_in')
        .set('Content-Type', 'application/json')
        .send({email: 'abc@gmail.com', password: 'paaaassword'})
        .end((err, res) => {
          expect(res.status).to.be.equal(400)
          expect(res.body).to.have.property('email');
          expect(res.body.email).to.be.equal('Either password or email is not found');
          done();
        });
    });
  });

});


describe('API Routes: sign_in an user (POST /api/v1/sign_in)', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ('should sign_in an user with valid credentials', (done) => {
    let user = new User({email: 'abc@gmail.com', password: 'password'});
    user.save((err, user) => {
      chai.request(server)
        .post('/api/v1/sign_in')
        .set('Content-Type', 'application/json')
        .send({email: 'abc@gmail.com', password: 'password'})
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('auth_token');
          done();
        });
    });
  });

  it ('should not sign_in an user with invalid credentials', (done) => {
    let user = new User({email: 'abc@gmail.com', password: 'password'});
    user.save((err, user) => {
      chai.request(server)
        .post('/api/v1/sign_in')
        .set('Content-Type', 'application/json')
        .send({email: 'abc@gmail.com', password: 'paaaassword'})
        .end((err, res) => {
          expect(res.status).to.be.equal(400)
          expect(res.body).to.have.property('email');
          expect(res.body.email).to.be.equal('Either password or email is not found');
          done();
        });
    });
  });

});

describe('API Routes: change password (POST /api/v1/change_password)', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ('should change password an user with valid password and auth_token', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'abc@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token  = res.body.auth_token;
        chai.request(server)
          .post('/api/v1/change_password')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .send({current_password: 'password', new_password: 'new_password'})
          .end((err, res) => {
            expect(res.status).to.be.equal(200)
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.be.equal(true);
            done();
          });
      });
  });

  it ('should not change password an user with invalid password', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'abc@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token  = res.body.auth_token;
        chai.request(server)
          .post('/api/v1/change_password')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .send({current_password: 'wrong', new_password: 'new_password'})
          .end((err, res) => {
            expect(res.status).to.be.equal(400)
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.be.equal('password is not valid');
            done();
          });
      });
  });
});

describe('API Routes: add to history (POST /api/v1/add_to_history/:id)', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ('should add movie to users history', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'abc@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token  = res.body.auth_token;
        chai.request(server)
          .put('/api/v1/add_to_history/add_awesome_movie')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .end((err, res) => {
            expect(res.status).to.be.equal(200)
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.equal(true);
            done();
          });
      });
  });

});


describe('API Routes: add to favourite (POST /api/v1/add_to_favourite/:id)', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ('should add movie to users favourite', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'abc@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token  = res.body.auth_token;
        chai.request(server)
          .put('/api/v1/add_to_favourite/add_awesome_movie')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .end((err, res) => {
            expect(res.status).to.be.equal(200)
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.equal(true);
            done();
          });
      });
  });

});


describe('API Routes: delete to favourite (DELETE /api/v1/delete_from_favourite/:id)', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ('should delete favourite movie from users favourite', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'abc@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token  = res.body.auth_token;
        chai.request(server)
          .put('/api/v1/add_to_favourite/add_awesome_movie')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .end((err, res) => {
            chai.request(server)
              .delete('/api/v1/delete_from_favourite/add_awesome_movie')
              .set('Content-Type', 'application/json')
              .set('Authorization', 'JWT ' + auth_token)
              .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.be.equal(true);
                done();
              });
          });
      });
  });

});


describe('API Routes: get list of users favourites (GET /api/v1/favourites)', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ('should get list of favourites for an user', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'abc@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token  = res.body.auth_token;
        chai.request(server)
          .put('/api/v1/add_to_favourite/add_awesome_movie')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .end((err, res) => {
            chai.request(server)
              .get('/api/v1/favourites')
              .set('Content-Type', 'application/json')
              .set('Authorization', 'JWT ' + auth_token)
              .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body).to.have.property('favourites');
                expect(res.body.favourites).to.be.an('array').that.include('add_awesome_movie');
                expect(res.body.favourites.length).to.be.equal(1);
                done();
              });
          });
      });
  });

});


describe('API Routes: get user history (GET /api/v1/history)', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ('should get an user history', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'abc@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token  = res.body.auth_token;
        chai.request(server)
          .put('/api/v1/add_to_history/add_awesome_movie')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .end((err, res) => {
            chai.request(server)
              .get('/api/v1/history')
              .set('Content-Type', 'application/json')
              .set('Authorization', 'JWT ' + auth_token)
              .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body).to.have.property('history');
                expect(res.body.history).to.be.an('array').that.include('add_awesome_movie');
                expect(res.body.history.length).to.be.equal(1);
                done();
              });
          });
      });
  });

});

