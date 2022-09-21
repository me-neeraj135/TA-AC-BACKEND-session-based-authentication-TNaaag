/** @format */

var express = require("express");
var router = express.Router();
var User = require(`../models/users`);

/* GET users listing. */

router.get("/", function (req, res, next) {
  res.send("index");
});

router.get(`/login`, (req, res, next) => {
  let error = req.flash(`error`)[0];
  console.log(req.session);

  res.render(`login`, { error });
});

// register user

router.get(`/register`, (req, res, next) => {
  res.render(`register`);
});

// get user register
router.post(`/register`, (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    // console.log(err, user);
    res.redirect(`/users/login`);
  });
});

// get user login

router.post(`/login`, (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash(`error`, `Email/Password required`);
    return res.redirect(`/users/login`);
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    // no user(null)

    if (!user) {
      req.flash(`error`, `user not found`);
      return res.redirect(`/users/login`);
    }

    // compare password

    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash(`error`, `invalid password`);
        return res.redirect(`/users/login`);
      }

      //  persist login info

      req.session.userId = user.id;

      res.render(`user`, { user });
    });
  });
});

// logout-session

router.get(`/logout`, (req, res, next) => {
  req.session.destroy();
  res.clearCookie(`connect.sid`);
  res.redirect(`/users/login`);
});

module.exports = router;
