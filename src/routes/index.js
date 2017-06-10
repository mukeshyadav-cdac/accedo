import express from 'express';
const router = express.Router();
import * as apiV1User from '../api/v1/users.js';

router.get('/', (req, res) => {
  console.log('mukesh')
  res.send(200);
});

router.post('/api/v1/users', apiV1User.createUser);

export default router;
