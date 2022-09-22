/** @format */

var express = require("express");

var User = require(`../models/user`);
var router = express.Router();

// login form
router.get(`/login`, (req, res, next) => {
  let msg = req.flash(`msg`)[0];
  // console.log(error);
  return res.render(`login`, { msg });
});

// register form

router.get(`/register`, (req, res, next) => {
  let error = req.flash(`error`)[0];
  return res.render(`register`, { error });
});

// get user register
router.post(`/register`, (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.code === 11000) {
        req.flash(`error`, `email already registered`);
        return res.redirect(`/users/register`);
      }
      if (err.name === `ValidationError`) {
        req.flash(`error`, err.message);
        return res.redirect(`/users/register`);
      }
      // return res.json({ err });
    }
    // console.log(err, user);
    req.flash(`msg`, `user successfully registered`);
    return res.redirect(`/users/login`);
  });
});

// get user login

router.post(`/login`, (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    req.flash(`msg`, `email/password required`);
    return res.redirect(`/users/login`);
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    // null user
    if (!user) {
      req.flash(`msg`, `email not registered`);
      return res.redirect(`/users/login`);
    }

    // verify password

    user.verifyPassword(password, (err, result) => {
      if (!result) {
        req.flash(`msg`, `invalid password`);
        return res.redirect(`/users/login`);
      }

      // persist session into database
      req.session.userId = user.id;
      return res.redirect(`/users/` + user.id);
    });
  });
});

// get user logout

router.get(`/logout`, (req, res, next) => {
  req.session.destroy();
  res.clearCookie(`connect.sid`);

  res.redirect(`/users/login`);
});

/* GET users listing. */

router.get("/:id", function (req, res, next) {
  let id = req.params.id;
  User.findById(id, (err, user) => {
    // console.log(req.session);
    return res.render(`user`, { user });
  });
});

module.exports = router;
