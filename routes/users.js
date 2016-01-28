var express = require('express');
var router = express.Router();
var passport = require("passport");


router.route("/login")
    .post(passport.authenticate("local"), function (req, res) {
        res.json({prelink: req.headers.referer})
    });

router.route("/register")
    .post(function (req, res) {
        req.checkBody('name', 'Invalid name').notEmpty();
        req.checkBody('email', 'Invalid email').isEmail();
        req.checkBody('password', 'Invalid password').notEmpty();
        req.checkBody('type', 'Invalid type').isIn(['driver', 'passenger']);
        req.checkBody('password', 'Passwords do not match').equals(req.body.confirmPassword);
        var errors = req.validationErrors();
        if (errors) {
            res.json({
                message: "Invalid input"
            })
        } else {
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.type = req.body.type;
            user.setPassword(req.body.password);
            user.save(function (err) {
                if (err) {
                    res.json({
                        message: " The email is already in use."
                    })
                } else {
                    res.json({prelink: req.headers.referer})
                }
            })
        }
    });

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
})


module.exports = router;