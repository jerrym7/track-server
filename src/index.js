require("./models/User"); //this is stated like this to only call it once to avoid errors, we need to load models to mongoose
require("./models/Track"); //this is stated like this to only call it once to avoid errors
const express = require("express"); //import express API
const mongoose = require("mongoose"); //import mongoose to connect to the mongo database
const authRoutes = require("./routes/authRoutes"); //import the router for authorization requests (signin and signup)
const trackRoutes = require("./routes/trackRoutes"); //import routes to
const requireAuth = require("./middlewares/requireAuth"); //gets the middleware and sets it in a variable

const bodyParser = require("body-parser"); //STEP ------> helper object used to parse a json object and handle next logic

const app = express(); //start the express app

app.use(bodyParser.json()); // STEP -----> it is above the authRoutes for app to be able to parse before the incoming request is sent
//STEP ----> those two lines with 'STEP' on it can be removed and added app.use(express.json()) (ExpressJS added those in their libraries)
app.use(authRoutes); //uses the route in the app
app.use(trackRoutes); //sets the express app to use the routes from track
//gets the Uri setting admin and password to connect to cluster from mongodb and connect to database
const mongoUri = "YOUR_MONGO_URI";

mongoose.connect(mongoUri); //create to mongodb

//this will be displayed if mongoose was connected to mongodb
mongoose.connection.on("connected", () => {
  console.log("It was connected to mongodb instance");
});

//if mongoose could not connect to monggodb log it
mongoose.connection.on("error", () => {
  console.error("Error connecting to mongodb");
});

//if someone does a req on '/' (root route) we want to run the call back function added
//this function also tells we will be using a middleware with req and res into middleware
app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`); //sends the response to the user
});

//sets the port to be 3000 for http://localhost3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
