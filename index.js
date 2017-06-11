var http = require('http');
var fs =require('fs');
var extract = require('./extractFilePath');
var wss = require('./websockets-server');

var handleError = function(err,res){
  res.writeHead(404);
  res.end();
}

var server = http.createServer(function(req,res){
  console.log('Responding to a requret.');

  var filePath = extract(req.url);

  fs.readFile(filePath, function(err,data){
    if(err){
      handleError(err,res)
    } else{
      res.end(data);
    }
  });
});
server.listen(8080);
