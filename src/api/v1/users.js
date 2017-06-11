import express from 'express';
const router = express.Router();
import User from '../../models/user.js';

let signUpUser = (req, res) => {
  let user = new User(req.body);
  user.save((err, user) => {
    if(err) {
      console.log(err)
    } else {
      res.send(user).status(200);
    }
  });
}

let signInUser = (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) {
      console.log(err)
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          console.log(err);
        } else {
          res.send(user).status(200);
        }
      });
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

let addToFavourite = (req, res) => {
  let user = req.user;
  User.update({ _id: user._id }, { $addToSet: {favourites: req.params['id']}}, (err, user) => {
    if (err) {
      console.log(err);
    }
    res.send({success: true});
  });
}

let deleteFromFavourite = (req, res) => {
  let user = req.user;
  User.update( {_id: user._id }, { $pullAll: { favourites: [req.params['id']] } }, (err) => {
    if ( err ) {
      console.log(err)
    } else {
      res.send({success: true});
    }
  });
}

let history = (req, res) => {
  let user = req.user;
  res.send({history: user.history});
}

let favourites = (req, res) => {
  let  user =  req.user;
  res.send({favourites: user.favourites});
}

export { signUpUser, signInUser, addToHistory, addToFavourite, deleteFromFavourite, history, favourites };
