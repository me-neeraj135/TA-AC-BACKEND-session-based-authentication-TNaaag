/** @format */

var User = require("../models/user");

module.exports = {
  loggedInUser: function (req, res, next) {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.redirect("/users/login");
    }
  },
  userInfo: function (req, res, next) {
    var userId = req.session && req.session.userId;
    if (userId) {
      User.findById(userId, "firstName lastName email", (err, user) => {
        // console.log(user);
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        return next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      return next();
    }
  },
};
