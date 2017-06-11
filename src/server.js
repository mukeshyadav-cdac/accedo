import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import config from '../config.js';
import routes from './routes';

const enviroment = process.env.NODE_ENV;

mongoose.connect(config[enviroment].MONGO_URI);
mongoose.Promise = global.Promise;

//mongoose.set('debug', true);
const app = express();

app.set('port', (process.env.PORT || config[enviroment].DEV_PORT ));

if (enviroment !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use('/', routes);

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
});

mongoose.connection
  .once('open', () => {
    app.listen(app.get('port'), ()  =>  {
      console.log('running on port', app.get('port'))
    });
    console.log('Connected to MongoLab instance.')
  })
  .on('error', error => console.log('Error connecting to MongoLab:', error));

// app.listen(app.get('port'), ()  =>  {
//   console.log('running on port', app.get('port'))
// });

export default app;
