var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var flash = require('connect-flash');
var nunjucks = require("nunjucks");
var passport = require("passport");
var session = require('express-session');
var cors = require("cors");


var config = require("./config");
var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var trip = require('./routes/trip');

mongoose.connect(config.dbConnstring);
global.User = require("./models/user");
global.Trip = require("./models/trip");

require("./passport");

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// view engine setup
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    }
    res.locals.messages = req.session.flash;
    delete req.session.flash;
    next()
});

app.use('/', routes);
app.use('/', users);
app.use('/', trip);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
