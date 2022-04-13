const mongoose = require('mongoose'); //import mongoose
const bcrypt = require('bcrypt'); //import library to create hash and salted string (random string)
//create userSchema with email and password

const userSchema = new mongoose.Schema({
    email: {
        type: String, //what type will the email variable be
        unique: true, //needs to be a unique passowrd and we do not want them repeated in mongoose
        required: true //needs to be entered for request to be accepted
    },
    password: {
        type: String, //what type of password is it going to be
        required: true //let user know that you have to enter a password all the time
    }
});

userSchema.pre('save', function(next) { //before it saves it will run this function, we need function keyword because we need 'this' key word
    const user = this; //get the user from the context
    if(!user.isModified('password')){//check if user has been modified
        return next();//return the function and run it
    }
    //generate the salt string and pass a call function to do
    bcrypt.genSalt(10, (err, salt) => {
        if(err){//if any error generating salt string
            return next(err); //go to next with err message err
        }
        //generate the hash for the password with (password to hash, saltString) to concatanate and also do a function after that
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err){//if any error hashing the password go to next with error message included
                return next(err);//go to next with error included
            }
            user.password = hash; //change the user.password to the new hash with salted string
            next();
        });
    });
});

//add method to compare a current user password with the password in the mongo database
userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this; //get the user schema from the current and compare the candidate(current) user's password 
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => { //function to compare two passwords
            if(err){//if any error 
                return reject(err);//there was a error and reject promise with err message
            }

            if(!isMatch){ //passwords did not match
                return reject(false);//reject promise with false value since it did not match
            }
            //passwords did match
            resolve(true);
        });
    });
};

mongoose.model('User', userSchema); //tell mongoose this is a schema to be added to mongodb