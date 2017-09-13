//setup dependencies
var express = require('express');
var compression = require('compression'); //gzip compression to speed up
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan'); //nice dev log package

//setup routes
var index = require('./routes/index');
var coffeeView = require('./routes/coffee');

//setup app
var app = express();
app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//setup middlewares to process request
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//setup routes
app.use('/', index);
app.use('/coffee', coffeeView);

//error catcher
app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//error handler
app.use(function(err, req, res, next){
    if(err.handled){
        console.log(err);
        console.log(err.stack);
    } else {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    }
});

module.exports = app;
