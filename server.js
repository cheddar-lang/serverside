require('./Cheddar.js')
var fs = require("fs");
var express = require('express');
var port = 4001;
var app = express()

var Cheddar = Function('return this')().Chedz;

var cheddarRoute = function(path, res){
    fs.readFile('www/' + path, function(error, data){
        if (error){
            throw error;
        }
        var output = "";
        var logger = console.log
        console.log = function(){
            var args = arguments
            Object.keys(arguments).forEach(function(key){
                let argument = args[key];
                output += argument.toString();
            });
        }
        logger(data.toString())
        try {
            Cheddar(data.toString())
        } catch (error){
            res.write(error.toString());
            return res.end()
        }
        console.log = logger;
        res.write(output);
        res.end()
    })
}

app.get('/', function(req, res){
    var path = req.path;
    console.log('index: - access attempt at path: ' + path)
    cheddarRoute(
        'index.chr',
        res
    )
})

app.get(/\.chr$/, function(req, res){
    var path = req.path;
    console.log('cheddar: - access attempt at path: ' + path)
    cheddarRoute(
        path,
        res
    )
})
app.get('*', function(req, res){
    var path = req.path;
    console.log('file: - access attempt at path: ' + path)
    res.sendFile(
        path.substring(path.lastIndexOf('/') + 1),
        {
            root: 'www/' + path.substring(0, path.lastIndexOf('/'))
        }
    );
})
app.listen(port)
console.log('Server listening on port ' + port)
