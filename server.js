var keys = require("./keys")    //This is keys.js reference
var tempKeys = require("./tempKeys")
var walmart = require('walmart')(tempKeys.walmartKeys);

walmart.getItem(10449075).then(function(item) {
    console.log(item.product.productName);
});
