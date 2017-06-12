process.env.NODE_ENV = 'test';
import { expect }  from 'chai';
import Movie from '../../src/models/movie.js';
import mongoose from 'mongoose';


describe('Movie Model: ', () => {

  before((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  afterEach((done) => {
    mongoose.connection.dropDatabase().then(function() {}).then(done, done);
  });

  it('should create a movie with title and id', (done) => {
    let movie = new Movie({title: 'first', id: 'first-id'});
    movie.save((err, movie) => {
      expect(movie._id).to.be.exist;
      expect(movie.title).to.be.equal('first');
      expect(movie.id).to.be.equal('first-id');
      done();
    });
  });

  it('should not create a movie without title', (done) => {
    let movie = new Movie();
    movie.save((err, movie) => {
      expect(err.errors.title).to.exist;
      expect(err.errors.title.message).to.be.equal('Title must be present');
      done();
    });
  });

  it('should not create a movie without id', (done) => {
    let movie = new Movie();
    movie.save((err, movie) => {
      expect(err.errors.id).to.exist;
      expect(err.errors.id.message).to.be.equal('Id must be present');
      done();
    });
  });
});
