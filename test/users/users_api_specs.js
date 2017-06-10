process.env.NODE_ENV = 'test';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import server from '../../src/server.js';

chai.use(chaiHttp);

describe('API Routes: user create(POST /api/v1/users', () => {
  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it ( 'should create an user with valid user', (done) => {
    console.log(process.env.NODE_ENV)
    console.log('...........................')
    chai.request(server)
      .post('/api/v1/users')
      .set('Content-Type', 'application/json')
      .send({email: 'test@gmail.com', password: 'password'})
      .end((err, res) => {
        //res.should.have.status(200);
        expect(res.status).to.be.equal(200)
        expect(res.body).to.have.property('email');
        expect(res.body.email).to.be.equal('test@gmail.com');
        expect(res.body).to.be.have.property('auth_token');
        done();
      })
  });
});
