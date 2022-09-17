/** @format */

var express = require("express");
const user = require("../models/user");
var router = express.Router();
let User = require(`../models/user`);
/* GET users register. */

router.get("/", function (req, res, next) {
  User.find((err, users) => {
    if (err) return next(err);
    res.render(`user`, { users });
  });
});

router.get(`/login`, (req, res, next) => {
  res.render(`login`);
});

router.get(`/register`, (req, res, next) => {
  res.render(`register`);
});

router.post(`/register`, (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    console.log(err, user);
    res.redirect(`/users`);
  });
});

module.exports = router;
