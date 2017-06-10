import passport from "passport";
import passportJWT from "passport-jwt";
import config from '../../config.js';
import User from '../models/user.js';

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let jwtOptions = {}

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = config[process.env.NODE_ENV].JWT_SECRET;

const jwtLogin = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
  User.findOne({_id: jwt_payload.id}, (err, user) => {
    if (err) {
      console.log(err)
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
