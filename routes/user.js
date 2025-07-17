const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const userController = require("../controllers/user")
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/isLoggedin")

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

router.route("/login")
.get((req, res) => {
    res.render("users/login.ejs");
}).post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.login))


router.get("/logout", userController.logout)
module.exports = router;