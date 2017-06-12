import express from 'express';
const router = express.Router();
import Movie from '../../models/movie.js';


let listMovies = (req, res) => {
  Movie.find({}, (err, movies) => {
    res.status(200).send({totalCount: movies.length, entries: movies});
  });
}

let createMovie = (req, res) => {
  let movie = new Movie(req.body);
  movie.save((err, movie) => {
    if ( err ) {
      console.log(err)
      let errorObject = {}
      Object.keys(err.errors).forEach(function (key) {
        errorObject[key] = err.errors[key].message
      });
      res.status(400).send(errorObject);
    } else {
      res.status(200).send(movie);
    }
  });
}

let filterMovies = (req, res) => {
  console.log('............................')
  console.log(req.query['q'])
  Movie.find({ $text: { $search: req.query['q'] } } , (err, movies) => {
    if (err) {
      console.log(err);
      res.status(400)
    } else {
      res.status(200).send({result: movies});
    }
  });
}

let deleteMovie = (req, res) => {
  Movie.remove({id: req.params['id']}, (err) => {
    if (err) {
      console.log(err);
      res.status(400);
    } else {
      res.status(200).send({success: true});
    }
  });
}

export { listMovies, createMovie, filterMovies, deleteMovie };
