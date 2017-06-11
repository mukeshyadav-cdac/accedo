import express from 'express';
const router = express.Router();
import Movie from '../../models/movie.js';


let listMovies = (req, res) => {
  if (req.user) {
    let movies = Movie.find({}, (err, movies) => {
      res.send({totalCount: movies.length, entries: movies});
    });
  } else {
    res.send(401);
  }
}

let createMovie = (req, res) => {
  let movie = new Movie(req.body);
  movie.save((err, movie) => {
    if ( err ) {
      console.log(err)
    } else {
      res.json(movie);
    }
  });
}

export { listMovies, createMovie };
