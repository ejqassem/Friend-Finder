//Dependencies
//=====================
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//Declare global variables and bodyparser methods to handle incoming data
//=====================================
var app = express();
var PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// set the static file location for CSS stylesheet and custom javascript file
app.use("/assets", express.static(path.join(__dirname + "/app/public/assets")));

//Importing apiRoutes and htmlRoutes and running them immediately by passing the returned objects
//the app variable, which references the express method, as an argument
//=====================================
require('./app/routing/apiRoutes.js')(app);
require('./app/routing/htmlRoutes.js')(app, path);

//Initializes the server to listen to PORT
//=====================================
app.listen(PORT, function() {
  console.log("You are now listening to " + PORT);
});
