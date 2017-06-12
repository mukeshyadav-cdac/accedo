import express from 'express';
const router = express.Router();
import Movie from '../../models/movie.js';

/**
 * @swagger
 * definition:
 *   Category:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       id:
 *         type: string
 */

 /**
 * @swagger
 * definition:
 *   Image:
 *     type: object
 *     properties:
 *       type:
 *         type: string
 *       url:
 *         type: string
 *       width:
 *         type: string
 *       height:
 *         type: string
 *       id:
 *         type: string
 */

 /**
 * @swagger
 * definition:
 *   ParentRating:
 *     type: object
 *     properties:
 *       scheme:
 *         type: string
 *       rating:
 *         type: string
 */

 /**
 * @swagger
 * definition:
 *   Credit:
 *     type: object
 *     properties:
 *       role:
 *         type: string
 *       name:
 *         type: string
 */

 /**
 * @swagger
 * definition:
 *   Content:
 *     type: object
 *     properties:
 *       url:
 *         type: string
 *       format:
 *         type: string
 *       width:
 *         type: string
 *       height:
 *         type: string
 *       language:
 *         type: string
 *       duration:
 *         type: string
 *       geoLock:
 *         type: string
 *       id:
 *         type: string
 */

 /**
 * @swagger
 * definition:
 *   Metadata:
 *     type: object
 *     properties:
 *       value:
 *         type: string
 *       name:
 *         type: string
 */

/**
 * @swagger
 * definition:
 *   Movie:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       type:
 *         type: string
 *       publishedDate:
 *         type: integer
 *       availableDate:
 *         type: integer
 *       id:
 *         type: integer
 *       categories:
 *         type: array
 *         items:
 *           $ref: "#/definitions/Category"
 *       images:
 *         type: array
 *         items:
 *           $ref: "#/definitions/Image"
 *       parentalRatings:
 *         type: array
 *         items:
 *           $ref: "#/definitions/ParentRating"
 *       credits:
 *         type: array
 *         items:
 *           $ref: "#/definitions/Credit"
 *       contents:
 *         type: array
 *         items:
 *           $ref: "#/definitions/Content"
 *       metadata:
 *         type: array
 *         items:
 *           $ref: "#/definitions/Metadata"
 */

/**
 * @swagger
 * /api/v1/movies:
 *   get:
 *     tags:
 *       - Movies
 *     description: Returns all movies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of movies
 *         schema:
 *           $ref: '#/definitions/Movie'
 */


let listMovies = (req, res) => {
  Movie.find({}, (err, movies) => {
    res.status(200).send({totalCount: movies.length, entries: movies});
  });
}

/**
 * @swagger
 * /api/v1/movies:
 *   post:
 *     tags:
 *       - Movies
 *     description: create a movie
 *     summary: "Add a new movie to the database"
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "Movie object that needs to be added to the db"
 *         schema:
 *           $ref: "#/definitions/Movie"
 *     responses:
 *       400:
 *         description: "Invalid input"
 *       200:
 *         description: An array of movies
 *         schema:
 *           $ref: '#/definitions/Movie'
 */

let createMovie = (req, res) => {
  let movie = new Movie(req.body);
  movie.save((err, movie) => {
    if ( err ) {
      console.log(err)
      let errorObject = {}
      if (err.errors) {
        Object.keys(err.errors).forEach(function (key) {
          errorObject[key] = err.errors[key].message
        });
      } else {
        errorObject['errors'] = 'Serever Error'
      }
      res.status(400).send(errorObject);
    } else {
      res.status(200).send(movie);
    }
  });
}

/**
 * @swagger
 * /api/v1/movies/filter:
 *   get:
 *     tags:
 *       - Movies
 *     description: filter a movie
 *     summary: "Add a new movie to the database"
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "query"
 *         name: "q"
 *         description: "test to be searched in movie database"
 *     responses:
 *       200:
 *         description: An array of movies
 *         schema:
 *           $ref: '#/definitions/Movie'
 */

let filterMovies = (req, res) => {
  Movie.find({ $text: { $search: req.query['q'] } } , (err, movies) => {
    if (err) {
      console.log(err);
      res.status(400)
    } else {
      res.status(200).send({result: movies});
    }
  });
}

/**
 * @swagger
 * /api/v1/movies/{:id}:
 *   delete:
 *     tags:
 *       - Movies
 *     description: delete a movie
 *     summary: "delete movie from database"
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "path"
 *         name: ":id"
 *         description: "id of movie to be deleted"
 *     responses:
 *       200:
 *         description: status object
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 */

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
