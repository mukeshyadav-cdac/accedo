import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import config from '../config.js';
import routes from './routes';
import swaggerJSDoc from 'swagger-jsdoc';

const enviroment = process.env.NODE_ENV;

mongoose.connect(config[enviroment].MONGO_URI);
mongoose.Promise = global.Promise;

const app = express();

if (enviroment !== 'test') {
  mongoose.set('debug', true);
}

if (enviroment !== 'test') {
  app.use(logger('dev'));
}

app.set('port', (process.env.PORT || config[enviroment].DEV_PORT ));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// swagger definition
let swaggerDefinition = {
  info: {
    title: '* Swagger API',
    version: '1.0.0',
    description: 'Auto generated REST Apis',
  },
  host: 'https://accedo-test-mukesh.herokuapp.com',
  basePath: '/api/v1/'
};

// options for the swagger docs
let options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./src/api/v1/movies.js', './src/api/v1/users.js'],
};

// initialize swagger-jsdoc
let  swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(express.static('public'))

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

export default app;
