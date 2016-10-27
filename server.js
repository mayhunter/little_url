var express = require("express");
var app = express();
var mongodb = require("mongodb").MongoClient;

app.get(/\/new\/.+/, function(req, res){
   
    var url = req.url.replace('/new/','');
    var startsWithHttp = url.startsWith('http://') ||  url.startsWith('https://');
    var output = {};
    if(startsWithHttp){
      
        var code;
      
            code = Math.floor(Math.random() * 1000000 + 1);
            
    
        // save url and shortcode as document into collection
        var newUrl = {'url' : url, 'shortcode' : req.headers.host + '/' + code, 'code' : code};
       mongodb.connect('mongodb://localhost:27017/shortdb').then(function(db){
           
            var codes = db.collection('shortcodes');
            return codes.insert(newUrl)}).then(function(data){
            
            
            // output url and shortcode as object
            res.send(JSON.stringify(newUrl));
            db.close();
        });

        
    }
    else{
        output = {'error' : 'Invalid url.  Please input a valid url'};
        res.send(JSON.stringify(output));
    }   
    
});

app.get('/:shortcode', function(req, res){
    var code = req.params.shortcode;
    code = Number(code);
   
     mongodb.connect('mongodb://localhost:27017/shortdb').then(function(db){
    
    

    var codes = db.collection('shortcodes');
    
    
    return codes.find({code: code}).toArray()}).then(function(items){
        
        if(items.length){
            res.redirect(items[0].url);
        }
        else{
            res.send({error: 'This shortcode is not found!'})
        }
       
    });
    
    
    
    
});
app.listen(8080);
