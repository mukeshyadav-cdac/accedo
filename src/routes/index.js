import express from 'express';
const router = express.Router();
import * as apiV1User from '../api/v1/users.js';
import * as apiV1Movie from '../api/v1/movies.js';
import passport from 'passport';
const passportService = require('../initializers/passport.js');

router.get('/', (req, res) => {
  console.log('mukesh')
  res.send(200);
});

router.post('/api/v1/sign_up', apiV1User.signUpUser);
router.post('/api/v1/sign_in', apiV1User.signInUser);

router.get('/api/v1/movies', passport.authenticate('jwt', { session: false }), apiV1Movie.listMovies);
router.get('/api/v1/movies/filter', passport.authenticate('jwt', { session: false }), apiV1Movie.listMovies);
router.post('/api/v1/movies', passport.authenticate('jwt', { session: false }), apiV1Movie.createMovie);
router.delete('/api/v1/movies/:id', passport.authenticate('jwt', { session: false }), apiV1Movie.createMovie);

export default router;
