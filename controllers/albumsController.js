import createError from "http-errors";

import User from "../models/User.js";
import Album from "../models/Album.js";

// POST /albums
//     body: {
//         userId: "",
//         title: "",
//         band: "",
//         year: "",
//     }
export const createAlbum = async (req, res, next) => {
    try {
        // Create a variable called currentUser
        // And initialize it by using the "User" model to search in the "users" collection
        // (This is asynchronous so we need to use "await")
        // If we find a user with the same _id, they become the value of "currentUser"
        // If no user with the same _id exists in the "users" collection, currentUser = undefined
        const currentUser = await User.findById(req.body._id);

        // If the user does not exist in the "users" collection...
        // Create a 401 ("Unauthorized") error and use next() to send it to the error handling middleware
        if (!currentUser) return next(createError.Unauthorized());

        let newAlbum;

        try {
            // Does the album the user is creating already exist in the "albums" collection?
            const existingAlbum = await Album.findOne({
                title: req.body.title,
                band: req.body.band,
                year: req.body.year
            });

            // If the album already exists, no need to add it to the "albums" collection again...
            // So send back a 200 ("Success") response to the frontend with the existing album's _id
            if (existingAlbum) return res.status(200).json(existingAlbum._id);

            // Create a new album using the "Album" model
            // This is useful because it uses a schema to tell us what an "album" should look like
            newAlbum = new Album({
                title: req.body.title,
                band: req.body.band,
                year: req.body.year
            });

            // Save the new album in the "albums" collection (this is asynchronous)...
            await newAlbum.save();

            // Send a response back to the frontend with 201 ("Created") status
            // In this response, we will include only the _id of the album we just saved in the "albums" collection 
            res.status(201).json(newAlbum._id);
        } catch (e) {
            // If there was an error creating the new Album, send back a 409 ("Forbidden") error
            console.log(e);
            next(createError.Forbidden());
        }
    } catch (e) {
        console.log(e);
        next(createError.InternalServerError());
    }
};

// ========================================================

// * Task 1: Create a function to delete all albums

export const deleteAllAlbums = async (req, res, next) => {
    try {
        // Destructure the request body to find the _id of the current user

        // Try to find the user who sent the request from the frontend

        // If there is no user with this _id in the "users" collection...
        // Use "http-errors" to return a 404 error ("Not Found") to the error handling middleware

        // If there is a user with this _id in the "users" collection...
        // Use Mongoose to update their "albums" field to an EMPTY array
        // Use whichever Mongoose technique you want, but make sure you save the updated user to the "users" collection!
        
        // Create an updated user object (containing "_id", "username" and "albums") to send back to the frontend

        // Send a response to the frontend, including the updated user details
    } catch (e) {
        // In case of an error, use "http-errors" to forward a 500 error (Internal Server Error) to the error handling middleware
    }
}



// ========================================================

// * Task 2: Create a function to delete a single album
// * Endpoint = "/albums/:albumId"
// Hint: if you get a bit stuck, you can check out your other controller functions to remember some helpful patterns. :-)

export const deleteAlbum = async (req, res, next) => {
    try {

    } catch {

    }
}