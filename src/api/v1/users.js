import express from 'express';
const router = express.Router();
import User from '../../models/user.js';

let signUpUser = (req, res) => {
  let user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      console.log(err)
      let errorObject = {}
      Object.keys(err.errors).forEach(function (key) {
        errorObject[key] = err.errors[key].message
      });
      res.status(400).send(errorObject);
    } else {
      res.status(200).send(user);
    }
  });
}

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

let history = (req, res) => {
  let user = req.user;
  res.status(200).send({history: user.history});
}

let favourites = (req, res) => {
  let  user =  req.user;
  res.status(200).send({favourites: user.favourites});
}

export { signUpUser, signInUser, addToHistory, addToFavourite, deleteFromFavourite, history, favourites, changePassword };
