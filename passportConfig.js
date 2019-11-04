const passport = require("passport")
const User = require("./models/user")
const LocalStrategy = require("passport-local").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const JwtStrategy = require("passport-jwt").Strategy
const jwt = require("jsonwebtoken") 

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
passport.use(new LocalStrategy(User.authenticate()))

const opt = {
    secretOrKey: "StriveSchoolLiveTesting",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

passport.use(new JwtStrategy(opt, (jwt_payload, next) => {
    User.findById(jwt_payload._id, (err, user) =>{
        if (err) return next(err, false)
        else if (user) return next(null, user)
        else return next(null, false)
    })
}))

module.exports = {
    createNewToken: user => jwt.sign(user, opt.secretOrKey, { expiresIn: 7200})
}