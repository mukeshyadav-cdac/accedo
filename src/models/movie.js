import mongoose from 'mongoose';
import config from '../../config.js';
import textSearch from 'mongoose-text-search';
import uniqueValidator  from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: 'Title must be present',
    index: true,
    text: true
  },

  description: {
    type: String,
    text: true
  },

  type: {
    type: String
  },

  publishedDate: {
    type: String
  },

  availableDate: {
    type: String
  },

  metadata: [{value: String, name: String}],

  contents: [{url: String, format: String, width: String, height: String, language: String, duration: String, geoLock: Boolean, id: String}],

  credits: [{role: String, name: {type: String, text: true}} ],

  parentalRatings: [{scheme: String, rating:String}],

  images: [{type: {type: String}, url: String, width: String, height: String, id: String}],

  categories: [{title: {type: String, text: true }, description: {type: String, text: true}, id:String}],

  id: {
    type: String,
    unique: true,
    index: true,
    required: 'Id must be present'
  }
});

movieSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        delete ret._id;
        delete ret.__v;
        ['categories', 'images', 'parentalRatings', 'credits', 'contents', 'metadata'].forEach((_type) => {
          ret[_type].forEach((doc) => {
            delete doc._id;
          })
        })
        return ret;
    }
};

movieSchema.plugin(uniqueValidator);
movieSchema.plugin(textSearch);
movieSchema.index({
  title: 'text',
  description: 'text',
  'categories.title': 'text',
  'categories.description': 'text',
  'credits.name': 'text'
});


const Movie = mongoose.model('movie', movieSchema);

export default Movie;
