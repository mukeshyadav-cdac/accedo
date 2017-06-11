import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import JWT from 'jsonwebtoken';
import config from '../../config.js';

const Schema = mongoose.Schema;

const match = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: 'Email must be present',
    match: [match, 'Invalid email format']
  },

  password: {
    type: String,
    required: 'Password must be present',
    minlength: [6, 'Password length should be minimum 6 character.']
  },

  history: [],

  favourites: []
});

userSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.email;
        delete ret.password;
        ret.auth_token = doc.auth_token;
        return ret;
    }
};

userSchema.pre('save', function(next) {
  let user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err)
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){return callback(err)}

    callback(null, isMatch)
  })
}

//userSchema.set('toJSON', { virtuals: true });

userSchema.virtual('auth_token')
  .get(function () {
    return JWT.sign({id: this._id }, config[process.env.NODE_ENV].JWT_SECRET)
  });


const User = mongoose.model('user', userSchema);

export default User;
