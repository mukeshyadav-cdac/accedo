process.env.NODE_ENV = 'test';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import server from '../../src/server.js';
import User from '../../src/models/user.js';

chai.use(chaiHttp);

describe('API Routes: create a movie (POST /api/v1/movies)', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ('should create a movie by authenticated user', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'test@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token = res.body.auth_token;
        chai.request(server)
          .post('/api/v1/movies')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .send({title: 'first', id: 'first'})
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body).to.have.property('id');
            expect(res.body).to.be.have.property('title');
            expect(res.body.title).to.be.equal('first');
            expect(res.body.id).to.be.equal('first');
            done();
          })
      });
  });

  it ('should not create a movie by unauthenticated user', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'test@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token = res.body.auth_token;
        chai.request(server)
          .post('/api/v1/movies')
          .set('Content-Type', 'application/json')
          .send({title: 'first', id: 'first'})
          .end((err, res) => {
            expect(res.status).to.be.equal(401);
            done();
          })
      });
  });

  it ('should not create a movie without title by an user', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'test@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token = res.body.auth_token;
        chai.request(server)
          .post('/api/v1/movies')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .send({id: 'first'})
          .end((err, res) => {
            expect(res.status).to.be.equal(400);
            expect(res.body.title).to.be.equal('Title must be present');
            done();
          })
      });
  });

  it ('should not create a movie without id by an user', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'test@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token = res.body.auth_token;
        chai.request(server)
          .post('/api/v1/movies')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .send({title: 'first'})
          .end((err, res) => {
            expect(res.status).to.be.equal(400);
            expect(res.body.id).to.be.equal('Id must be present');
            done();
          })
      });
  });
});

describe('API Routes: list all movies (GET /api/v1/movies)', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ( 'should list all the movies', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'test@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token = res.body.auth_token;
        chai.request(server)
          .post('/api/v1/movies')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .send({title: 'first', id: 'first'})
          .end((err, res) => {
            chai.request(server)
              .get('/api/v1/movies')
              .set('Content-Type', 'application/json')
              .set('Authorization', 'JWT ' + auth_token)
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body.totalCount).to.be.equal(1);
                expect(res.body).to.be.have.property('entries');
                expect(res.body.entries).to.be.an('array');
                expect(res.body.entries[0].title).to.be.equal('first');
                expect(res.body.entries[0].id).to.be.equal('first');
                done();
              });
          });
      });
  });
});

describe('API Routes: delete a movie (DELETE /api/v1/movies/:id)', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ( 'should delete a movie', (done) => {
    chai.request(server)
      .post('/api/v1/sign_up')
      .set('Content-Type', 'application/json')
      .send({email: 'test@gmail.com', password: 'password'})
      .end((err, res) => {
        let auth_token = res.body.auth_token;
        chai.request(server)
          .post('/api/v1/movies')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'JWT ' + auth_token)
          .send({title: 'first', id: 'first'})
          .end((err, res) => {
            chai.request(server)
              .get('/api/v1/movies')
              .set('Content-Type', 'application/json')
              .set('Authorization', 'JWT ' + auth_token)
              .end((err, res) => {

                chai.request(server)
                  .delete('/api/v1/movies/first')
                  .set('Content-Type', 'application/json')
                  .set('Authorization', 'JWT ' + auth_token)
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.have.property('success');
                    expect(res.body.success).to.be.equal(true);
                    done();
                  });
              });
          });
      });
  });
});


