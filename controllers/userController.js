import createError from "http-errors";

// Import User model
import User from "../models/User.js";

// The new function getUser sends a response containing the user details,
// as well as the albums that are linked to them in the albums array (see User model).
// To identify the user, we take the userId provided by req.params.
export const getUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        // We fetch the user from the database with the function findById(userId).
        // If the userId exists, this will return the whole user document.
        // We then add details about the albums to the result by using populate("albums") with the property name as the first parameter.
        // If we only use this one argument, we will get the whole album document.
        // The second parameter is responsible for filtering only the information that we need.
        // Each property that shall be returned needs to be listed with a truthy value (true, 1 etc.).
        const currentUser = await User.findById(userId).populate("albums", {
            _id: 1,
            title: 1,
            band: 1,
            year: 1,
        });

        // Another way to return the required properties only is to make the second populate() parameter a string
        // that contains all props separated by a space.
        // Please do not use this one as it is harder to read and to debug, especially in larger projects.
        // const currentUser = await User.findById(userId).populate("albums", "_id title band year");

        if (!currentUser) return next(createError.NotFound());

        // We create a new object that will be returned by the controller.
        // In here, we extract the username and albums properties from the user record.
        // To answer the question "how many albums does this user like?" we calculate the count by checking the length of the albums array
        // and add that value to our response object.
        const response = {
            username: currentUser.username,
            albums: currentUser.albums,
            albumCount: currentUser.albums.length,
        };

        res.json(response);
    } catch (error) {
        console.log(error);
        next(createError.InternalServerError());
    }
};


// PATCH /user/:userId
//     body: {
//       albumId: "",
//     }
export const updateUser = async (req, res, next) => {
    try {
        // Find the current user in the "users" collection, using the User model
        // Note: this time, we are getting the userId from the PARAMS of the request
        // For the url: "http://localhost:3001/user?abcd1234" => userId = "abcd1234"
        const currentUser = await User.findById(req.params.userId);

        // If the current user doesn't exist return a 404 error ("Not Found") via the error handling middleware
        if (!currentUser) return next(createError.NotFound());

        // Create a variable by using the albumId from the the BODY of the current request
        const albumId = req.body.albumId;
        
        // If there is no albumId in the request body...
        // Return back a 400 ("Bad Request") error
        if (!albumId) return next(createError.BadRequest());

        // If the currentUser already has the new album's _id in their "albums" array, return a 409 error ("Conflict")
        if (currentUser.albums.includes(albumId)) return next(createError.Conflict());    

        // Add the new album's _id to the currentUser's "albums" array
        currentUser.albums = [...currentUser.albums, albumId];
        
        // Save the user to the "users" collection
        await currentUser.save();

        // Populate the "albums" array to get the "title", "band" and "year" of EACH album
        await currentUser.populate("albums");

        // Prepare an object with the details to send back to the frontend
        const updatedUser = {
            _id: currentUser._id,
            username: currentUser.username,
            albums: currentUser.albums  // Populated!
        }

        // Send back the updated user to the frontend
        res.json(updatedUser);
    } catch (e) {
        console.log(e);
        next(createError.InternalServerError());
    }
};


// DELETE /user/:userId
export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const currentUser = User.findById(userId);

        if (!currentUser) {
            return next(createError.NotFound());
        }

        // Try to use findByIdAndRemove()
        await User.findByIdAndRemove(userId);

        console.log(`User with _id ${userId} was removed from the "users" collection!`);

        const updatedUser = {
            _id: "",
            username: "",
            albums: []
        }

        res.json(updatedUser);
    } catch(e) {
        next(createError.InternalServerError());
    }
}