var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get('*', function(req,res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'))
})

app.listen(port, function (){
  console.log("Running The Server on port" + port)
});