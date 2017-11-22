var keys = require(".././keys")    //This is keys.js reference
var tempKeys = require(".././tempKeys")
var walmart = require('walmart')(tempKeys.walmartKeys);

module.exports = function(app, passport){
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req,res){
        res.render('home.handlebars');
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req,res){
        res.render('login.handlebars', {message: req.flash('loginMessage')});
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.handlebars', { message: req.flash('signupMessage') });
    });
    
    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.handlebars', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // =====================================
    // WALMART ======== ALL Products Listing
    // =====================================
    app.get('/walmart', function (req, res) {
        //getItem(Item number on Walmart)
        //console.log(req);
        walmart.getItem(req.params.productid).then(function(item) {
            //console.log(item.product.primaryImageUrl);
            var imgAssets = item.product.imageAssets;
            for (var i = 0; i < imgAssets.length; i++){
                //console.log(imgAssets[i]);
                var heroImg = imgAssets[i].versions.hero;
                console.log(heroImg);
                // res.setHeader("Content-Type", "text/html");
                // res.write("<img src = '" + heroImg + "'/>");
            }
            //res.send(req.params);
            res.render("walmart.handlebars", {objWalmart: imgAssets});
        });
    });

    //Walmart search by specific product ID
    
    app.get('/walmart/:productid', function (req, res) {
        //getItem(Item number on Walmart)
        
        //Used this debug to find out what is the item I need to get from req.params 
        //and process accordingly
        //console.log(req);

        walmart.getItem(req.params.productid).then(function(item) {
            //console.log(item.product.primaryImageUrl);
            var imgAssets = item.product.imageAssets;
            for (var i = 0; i < imgAssets.length; i++){
                //console.log(imgAssets[i]);
                var heroImg = imgAssets[i].versions.hero;
                console.log(heroImg);
                // res.setHeader("Content-Type", "text/html");
                // res.write("<img src = '" + heroImg + "'/>");
            }
            //res.send(req.params);
            res.render("walmart.handlebars", {objWalmart: imgAssets});
        });
    });

    // =====================================
    // TESCO (tesco.handlebars) ========
    // =====================================

    app.get("/tesco", function(req,res){
        Tesco.search('Kellogs Cornflakes', { offset: 0, limit: 10 }, function(err, response) {
            if (err) console.log(err);
            console.log(response);
        })
    });

};

    // =====================================
    // ROUTE MIDDLEWARE ====================
    // =====================================

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};