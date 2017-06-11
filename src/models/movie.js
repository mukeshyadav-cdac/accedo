import mongoose from 'mongoose';
import config from '../../config.js';
import textSearch from 'mongoose-text-search';

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: 'Title must be present',
  },

  description: {
    type: String
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

  credits: [{role: String, name: String}],

  parentalRatings: [{scheme: String, rating:String}],

  images: [{type: {type: String}, url: String, width: String, height: String, id: String}],

  categories: [{title: String, description: String, id:String}],

  id: {
    type: String,
    unique: true
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
