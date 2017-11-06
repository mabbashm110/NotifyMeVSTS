var keys = require("./keys")    //This is keys.js reference
var tempKeys = require("./tempKeys")
var walmart = require('walmart')(tempKeys.walmartKeys);

//Express
var express = require('express'), 
    config = require('./config/app'), 
    app = express(),
    exphbs  = require('express-handlebars'),

    port     = process.env.PORT || 8080,
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash    = require('connect-flash'),
    morgan       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),
    
    configDB = require('./config/database.js'),

    Fitbit = require('fitbit'),
    TescoAPI = require('tesco'),
    Tesco = new TescoAPI.default('apikey');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//app.set('view engine', 'ejs'); // set up ejs for templating
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// required for passport
app.use(session({ secret: 'iloveNotifyMe' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//Walmart is home route
app.get('/', function (req, res) {
    //getItem(Item number on Walmart)
    walmart.getItem(45075624).then(function(item) {
        //console.log(item.product.primaryImageUrl);
        var imgAssets = item.product.imageAssets;
        for (var i = 0; i < imgAssets.length; i++){
            //console.log(imgAssets[i]);
            var heroImg = imgAssets[i].versions.hero;
            console.log(heroImg);
            // res.setHeader("Content-Type", "text/html");
            // res.write("<img src = '" + heroImg + "'/>");
        }
        res.render("home", {objWalmart: imgAssets});
    });
});

app.get("/tesco", function(req,res){
    Tesco.search('Kellogs Cornflakes', { offset: 0, limit: 10 }, function(err, response) {
        if (err) console.log(err);
        console.log(response);
    })
});

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port)