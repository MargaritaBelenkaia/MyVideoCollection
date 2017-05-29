//IMPORTANT: IF YOU'RE YOUSING NODEMON YOU NEED TO UNCOMMENT THE PORT SETTING.
//IF YOU PREFER NPM START - PLEASE KEEP AS IS.

var express       = require('express');
var path          = require('path');
var mongoose      = require("mongoose");
var logger        = require('morgan');
var bodyParser    = require('body-parser');
//var port = process.env.PORT || 3000;
var router        = express.Router();
var appRoutes     = require('./app/routes/api')(router);

var app           = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', appRoutes);

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/PlaylistDB", function(err) {
  if(err) {
    console.log("Error: " + err);
  }
  else {
    console.log("Connected to MongoDB.");
  }
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

module.exports = app;

/*app.listen (port, function() {
  console.log ("Running on port " + port)
})*/
