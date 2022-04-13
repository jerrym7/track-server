
const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth'); //make sure they are signed in

const Track = mongoose.model('Track');

const router = express.Router();

router.use(requireAuth);//requires the user to be signed in

/**
 * This function will get into mongodb to fetch all tracks created in the db
 * GET request === looks at all tracks by given user
 */
router.get('/tracks', async (req, res) => { //client will pass user's id through req to find all tracks
    const tracks = await Track.find({userId: req.user._id}); //gets all tracks from mongo database given a user_id
    res.send(tracks); //sends tracks to the client (react)
});

/**
 * This function will add tracks with name and locations
 * POST Request ==== this will add tracks to mongo database given a nameOfTracks and locations
 */
router.post('/tracks', async (req, res) => { //
   //req.body ( name , locations[] OBJECT {timestamp: , coordsObject})

   const { name, locations } = req.body; //detructure the name and location from client's request
   if(!name || !locations){ //if there is no name or locations
       return res.status(422).send({error: 'You must provide a name and locations'}); //send react the error code and error message
   }
   try{//try-catch block due to async thread
    const track = new Track({name: name, locations: locations, userId: req.user._id});  //create a track object using clients params
    await track.save(); //save it to mongo database
    res.send(track);//send the track to react (client's side)
   }catch(err){ //if any error in the try-catch block
       res.status(422).send({error: err.message}); //send the response with error code and error message
   }
});

module.exports = router; //export the routes from tracks