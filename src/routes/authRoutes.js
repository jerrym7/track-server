const express = require('express'); //initialize express
const mongoose = require('mongoose');//import mongoose
const User = mongoose.model('User'); //import user schema model
const jwt = require('jsonwebtoken'); //imported from npm library to get a JWT 
const router = express.Router(); //router is a object that allows us to asocciate some numbers of routes withit

/**
 * post request for signing up
 */
router.post('/signup', async (req, res) => {
    const { email, password } = req.body; //destructuring email and password from http req params
    try{
        const user = new User ({email, password}); //get a new User object with email and password that we got from req variable
        await user.save(); //async method to save the user in the mongodb
        const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY');//second key is a special key that we don't want to share on the outside world for security purposes(if they have the key they will be able to decrypt or edit the JWT.).

        res.send({token: token}); //sends token to user
    } catch(err){
        return res.status(422).send(err.message); //send status code and error message to user
    }
});

/**
 * POST request to sign in with params password and email from the user
 */
router.post('/signin', async (req, res) => {
    const {email, password } = req.body; //destructure email and password from http request

    if(!email || !password) { //if there is no email or no password 
        res.status(422).send({error: 'Must provide email and password'});//returns status 422 with error message
    }

    const user = await User.findOne({email}); //get the user by email and if there is one then set it to the user

    if(!user){ //checks if there is no user set
        return res.status(404).send({error: 'Invalid password or email'}); //sends respond to user with status 404 and sends a error message
    }
    try{//try-catch block due to async
        await user.comparePassword(password);
        const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY');//GET JWT FOR FUTURE USE with server-key from the user_id
        res.send({token});//if user's password did match send the user a token -JWT for future use of website to be able to know if user is the person working on website
    }catch(err){ //if any error code on the try-catch block
        return res.status(404).send({error: 'Invalid password or email'}); //sends the status code with error code message to the user
    }
});

module.exports = router; //export the routes