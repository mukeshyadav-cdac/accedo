import express from 'express';
const router = express.Router();
//import User from '../../models/movie.js';


let listMovies = (req, res) => {
  console.log(req.user)
  if (req.user) {
    res.send(req.user).send(200);
  } else {
    res.send(401);
  }
}

export { listMovies };
