const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});


/** Example of how to get data passed to get route and pass data to a get route */
// router.get("/login", (req, res, next) => {
//   res.render("auth/login", { "message": req.query.errorMessage ? req.query.errorMessage : false });
//                                                              |                |
/** To get data in a get route you would have to use req.query.<name of the paramter> */

//   // res.redirect('/login', { errorMessage: 'This is the error' }); /** This would not work to pass a query to the get route */
//   res.redirect(url.format({
  //        pathname:"/login",
  //        query: { errorMessage: 'This is the error message' }
  //      }));  |
//              |
/** In order to redirect in a route and pass data you have to use the above method to set the path of the redirect as well as the query for the data your trying to pass */
// });

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
