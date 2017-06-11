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

let filterMovies = (req, res) => {
  let movies = Movie.find({ $text: { $search: req.query['q'] } } , (err, movies) => {
    if (err) {
      console.log(err);
    } else {
      res.send(movies);
    }
  });
}

let deleteMovie = (req, res) => {
  Movie.remove({id: req.params['id']}, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send({success: true});
    }
  });
}

let addToHistory = (req, res) => {
  let user = req.user;
  user.history.push(req.params['id']);
  user.save((err, user) => {
    res.send({success: true});
  });
}


export { listMovies, createMovie, filterMovies, deleteMovie };
