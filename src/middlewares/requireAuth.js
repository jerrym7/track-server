const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
//JWT is a token from as a string to validate that current user is the user that logged in when inputed password. (JWT is a way to prove the server that user is not someone else)
/**
 * Function to extract the JWT and see if the current user is signed in
 * @param {*} req === will have the params and the headers of a http call
 * @param {*} res === is the variable we will send to the client as response
 * @param {*} next === next is a call back function to do after instructions are done, (for middleware to know that this middleware is done, and next middleware can be called from an array of middlewares)
 * @returns
 */
module.exports = (req, res, next) => {
  ///req has params of http and headers, res === the response to sent to user, next is callback to finish the middleware
  const { authorization } = req.headers;
  //authorization === 'Bearer kjhadgfksgfhjkdsgjhfgjhsgjhfdgdjhsgfjhsgjhfgjs'
  if (!authorization) {
    //if no authorization header, send error
    //meaning they are not the user they say they are
    return res.status(401).send({ error: "You must be logged in" });
  }
  const token = authorization.replace("Bearer ", ""); //remove the bearer and space characters from string to get the JWT.
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    //verify if tokenSentByUser is the same as tokenFromServerWithServerStringKey, and callback function to do if any issues
    if (err) {
      //if any error verifying (or JWT is not equal to user's JWT) then return a error ambigous to avoid hackers to know the issue
      return res.status(401).send({ error: "You must be logged in." });
    }

    const { userId } = payload; //payload has userId, so we will be destructuring it since the JWT is the same

    const user = await User.findById(userId); //get the user by userId from mongo database
    req.user = user; // add user found by mongodb and set it to the req variable
    next(); //end the middleware, call next middleware
  });
};
