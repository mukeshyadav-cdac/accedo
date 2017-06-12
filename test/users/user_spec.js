process.env.NODE_ENV = 'test';
import { expect }  from 'chai';
import User from '../../src/models/user.js';
import mongoose from 'mongoose';


describe('User Model: ', () => {

  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it('should be invalid if email is empty', (done) => {
    let user = new User();
    user.validate((err) => {
      expect(err.errors.email).to.exist;
      done();
    });
  });

  it('should be invalid if password is empty', (done) => {
    let user = new User();
    user.validate((err) => {
      expect(err.errors.password).to.exist;
      done();
    });
  });

  it('should be invalid if format does not match', (done) => {
    let user = new User({email: 'invalid_formate'});
    user.validate((err) => {
      expect(err.errors.email).to.exist;
      done();
    });
  });

  it('should show "Email must be present" error for empty email.', (done) =>{
    let user = new User();
    user.validate((err) => {
      expect(err.errors.email.message).to.be.equal('Email must be present');
      done();
    });
  });

  it('should show "Password must be present" error for empty email.', (done) =>{
    let user = new User();
    user.validate((err) => {
      expect(err.errors.password.message).to.be.equal('Password must be present');
      done();
    });
  });

  it('should show "Invalid email format" error message for invalid email.', (done) =>{
    let user = new User({email: 'invalid_formate'});
    user.validate((err) => {
      expect(err.errors.email.message).to.be.equal('Invalid email format');
      done();
    });
  });

  it('should show "Password length should be more than 6 character." error message for short password.', (done) =>{
    let user = new User({password: 'wrong'});
    user.validate((err) => {
      expect(err.errors.password.message).to.be.equal('Password length should be minimum 6 character.');
      done();
    });
  });

  it('should save email in lowercase format', (done) => {
    let user = new User({email: 'Ab2cD@gmail.com', password: 'password'})
    user.save((err, user) => {
      expect(user.email).to.be.equal('ab2cd@gmail.com');
      done()
    });
  });

  it('should save password in encryption format', (done) => {
    let user = new User({email: 'abc@gmail.com', password: 'password'})
    user.save((err, user) => {
      expect(user.email).to.be.equal('abc@gmail.com');
      expect(user.password).to.not.equal('password');
      done()
    });
  });

  it('should compare password correctly', (done) =>{
    let user = new User({email: 'abc@gmail.com', password: 'password'});
    user.save((err, new_user) => {
      user.comparePassword('password', (err, isMatch) => {
        expect(isMatch).to.be.equal(true);
        user.comparePassword('wrongpass', (err, isMatch) => {
          expect(isMatch).to.be.not.equal(true);
          done();
        })
      });
    });
  });

  it('should create history for viewing a movie', (done) => {
    let user = new User({email: 'abc@gmail.com', password: 'password'});
    user.save((err, new_user) => {
      user.history.push('a_new_movie');
      user.save((err, new_user) => {
        expect(new_user.history).to.be.an('array').that.include('a_new_movie');
        expect(new_user.history.length).to.be.equal(1);
        done();
      });
    });
  });

  it('should create favourite for viewing a movie', (done) => {
    let user = new User({email: 'abc@gmail.com', password: 'password'});
    user.save((err, new_user) => {
      user.favourites.push('a_new_movie');
      user.save((err, new_user) => {
        expect(new_user.favourites).to.be.an('array').that.include('a_new_movie');
        expect(new_user.favourites.length).to.be.equal(1);
        done();
      });
    });
  });

});
