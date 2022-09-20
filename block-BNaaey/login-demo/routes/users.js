/** @format */

var express = require("express");
var router = express.Router();

let User = require(`../models/users`);

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("index");
});

// get login

router.get(`/login`, (req, res, next) => {
  res.render(`login`);
});

// get register

router.get(`/register`, (req, res, next) => {
  res.render(`register`);
});

router.post(`/register`, (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    console.log(user);

    res.redirect(`/users/login`);
  });
});

// login user

router.post(`/login`, (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.redirect(`/users/login`);
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    // no user

    if (!user) {
      return res.redirect(`/users/login`);
    }

    // compare password

    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        return res.redirect(`/users/login`);
      }

      // persist login info

      req.session.userId = user.id;
      console.log(user);
      res.render(`users`);
    });
  });
});

module.exports = router;
