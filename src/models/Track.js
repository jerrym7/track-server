const mongoose = require('mongoose'); //import mongoose to set the schemas. 

//pointSchema to save for each point and time from a user
const pointSchema = new mongoose.Schema({
    timestamp: Number, //this is to safe the timestamp with a big number to see what time user saved it
    coords: { //this will save all coordinates, with below variables, this object will create a uniqueid
        latitude: Number, //sets latitude to a big number variable and below attributes
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number
    }
});

//track schema will consist of userid, name of track, and locations given an array of pointSchema
const trackSchema = new mongoose.Schema({
    userId:{ //userId saved to schema to be able to retreive for future use
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: { //name of the track given by user
        type: String,
        default: ''
    },
    locations: [pointSchema] //this will set a locations: is an array of pointSchema object above, locations attribute will add a unique id by mongodb
});

mongoose.model('Track', trackSchema); //this will let the mongoose database know and set the new model.