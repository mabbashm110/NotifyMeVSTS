var keys = require("./keys")    //This is keys.js reference
var tempKeys = require("./tempKeys")
var walmart = require('walmart')(tempKeys.walmartKeys);

//Express
var express = require('express'), 
    config = require('./config/app'), 
    app = express(),
    exphbs  = require('express-handlebars'),
    Fitbit = require('fitbit'),
    TescoAPI = require('tesco');
    Tesco = new TescoAPI.default('apikey');;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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
})

app.get("/tesco", function(req,res){
    Tesco.search('Kellogs Cornflakes', { offset: 0, limit: 10 }, function(err, response) {
        if (err) console.log(err);
        console.log(response);
})

app.listen(3000)