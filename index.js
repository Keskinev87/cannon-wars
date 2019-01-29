var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
const PORT = process.env.PORT || 4000;

app.use(express.static('client'))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

http.listen(PORT, function(){
    console.log('listening on *:4000');
});
