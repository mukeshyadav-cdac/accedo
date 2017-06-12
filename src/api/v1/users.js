import express from 'express';
const router = express.Router();
import User from '../../models/user.js';

/**
 * @swagger
 * /api/v1/sign_up:
 *   post:
 *     tags:
 *       - User
 *     description: sign up
 *     summary: "sign up an user"
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "body"
 *         name: "email"
 *         required: true
 *         description: "email of an user"
 *       - in: "body"
 *         name: "password"
 *         required: true
 *         description: "password of an user"
 *     responses:
 *       200:
 *         description: auth token of an user
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             auth_token:
 *               type: string
 */

let signUpUser = (req, res) => {
  let user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      console.log(err)
      let errorObject = {}
      if ( err.errors ) {
        Object.keys(err.errors).forEach(function (key) {
          errorObject[key] = err.errors[key].message
        });
      } else {
        errorObject['errors'] = 'Server Error'
      }
      res.status(400).send(errorObject);
    } else {
      res.status(200).send(user);
    }
  });
}

/**
 * @swagger
 * /api/v1/sign_in:
 *   post:
 *     tags:
 *       - User
 *     description: sign in
 *     summary: "sign in an user"
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "body"
 *         name: "email"
 *         required: true
 *         description: "email of an user"
 *       - in: "body"
 *         name: "password"
 *         required: true
 *         description: "password of an user"
 *     responses:
 *       200:
 *         description: auth token of an user
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             auth_token:
 *               type: string
 */

let signInUser = (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) {
      console.log(err)
      let errorObject = {}
      Object.keys(err.errors).forEach(function (key) {
        errorObject[key] = err.errors[key].message
      });
      res.status(400).send(errorObject);
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          console.log(err);
        } else if (!isMatch) {
          res.status(400).send({email: 'Either password or email is not found'});
        } else if (isMatch) {
          res.status(200).send(user);
        }
      });
    }
  });
}

/**
 * @swagger
 * /api/v1/change_password:
 *   post:
 *     tags:
 *       - User
 *     description: change password
 *     summary: "change password"
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "body"
 *         name: "current_password"
 *         required: true
 *         description: "current password an user"
 *       - in: "body"
 *         name: "new_password"
 *         required: true
 *         description: "new password of an user"
 *     responses:
 *       200:
 *         description: status of result
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 */

let changePassword = (req, res) => {
  let user = req.user;
  user.comparePassword(req.body.current_password, (err, isMatch) => {
    if ( isMatch) {
      user.password = req.body.new_password;
      user.save((err, user) => {
        if (err) {
          console.log(err);
          let errorObject = {}
          Object.keys(err.errors).forEach(function (key) {
            errorObject[key] = err.errors[key].message
          });
          res.status(400).send(errorObject);
        } else {
          res.status(200).send({status: true});
        }
      });
    } else {
      res.status(400).send({status: 'password is not valid'});
    }
  });
}

/**
 * @swagger
 * /api/v1/add_to_history/{:id}:
 *   put:
 *     tags:
 *       - User
 *     description: add to history
 *     summary: "add to history"
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "path"
 *         name: ":id"
 *         description: "id of movie"
 *     responses:
 *       200:
 *         description: status of operation
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 */

let addToHistory = (req, res) => {
  let user = req.user;
  user.history.push(req.params['id']);
  user.save((err, user) => {
    if ( err ) {
      let errorObject = {}
      Object.keys(err.errors).forEach(function (key) {
        errorObject[key] = err.errors[key].message
      });
      res.status(400).send(errorObject);
    } else {
      res.status(200).send({success: true});
    }
  });
}

/**
 * @swagger
 * /api/v1/add_to_favourite/{:id}:
 *   put:
 *     tags:
 *       - User
 *     description: add to favourite
 *     summary: "add to favourite"
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "path"
 *         name: ":id"
 *         description: "id of movie"
 *     responses:
 *       200:
 *         description: status of operation
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 */

let addToFavourite = (req, res) => {
  let user = req.user;
  User.update({ _id: user._id }, { $addToSet: {favourites: req.params['id']}}, (err, user) => {
    if (err) {
      console.log(err);
      let errorObject = {}
      Object.keys(err.errors).forEach(function (key) {
        errorObject[key] = err.errors[key].message
      });
      res.status(400).send(errorObject);
    } else {
      res.status(200).send({success: true});
    }

  });
}

/**
 * @swagger
 * /api/v1/add_to_favourite/{:id}:
 *   delete:
 *     tags:
 *       - User
 *     description: delete from favourite
 *     summary: "delete from favourite"
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "path"
 *         name: ":id"
 *         description: "id of movie"
 *     responses:
 *       200:
 *         description: status of operation
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 */

let deleteFromFavourite = (req, res) => {
  let user = req.user;
  User.update( {_id: user._id }, { $pullAll: { favourites: [req.params['id']] } }, (err) => {
    if ( err ) {
      console.log(err);
      let errorObject = {}
      Object.keys(err.errors).forEach(function (key) {
        errorObject[key] = err.errors[key].message
      });
      res.status(400).send(errorObject);
    } else {
      res.status(200).send({success: true});
    }
  });
}

/**
 * @swagger
 * /api/v1/history:
 *   get:
 *     tags:
 *       - User
 *     description: get user's history
 *     summary: "get user's history"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: list of movies
 *         schema:
 *           type: object
 *           properties:
 *             history:
 *               type: array
 */

let history = (req, res) => {
  let user = req.user;
  res.status(200).send({history: user.history});
}

/**
 * @swagger
 * /api/v1/favourites:
 *   get:
 *     tags:
 *       - User
 *     description: get user's favourites
 *     summary: "get user's favourites"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: list of movies
 *         schema:
 *           type: object
 *           properties:
 *             favourites:
 *               type: array
 */

let favourites = (req, res) => {
  let  user =  req.user;
  res.status(200).send({favourites: user.favourites});
}

export { signUpUser, signInUser, addToHistory, addToFavourite, deleteFromFavourite, history, favourites, changePassword };
