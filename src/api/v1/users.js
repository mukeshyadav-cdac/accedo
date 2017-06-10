import express from 'express';
const router = express.Router();
import User from '../../models/user.js';

let createUser = (req, res) => {
  let user = new User(req.body)
  user.save((err, user) => {
    if(err) {
      console.log(err)
    }
    res.send(user).status(200);
  });
}


export { createUser };
