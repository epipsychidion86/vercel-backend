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


// PATCH /users/:userId
//     body: {
//       albumId: "",
//     }
export const updateUser = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.params.userId);

        if (!currentUser) return next(createError.NotFound());

        const albumId = req.body.albumId;
        if (!albumId) return res.status(204).send();

        if (currentUser.albums.includes(albumId)) {
            currentUser.albums = currentUser.albums.filter(album => album != albumId);
        } else {
            currentUser.albums = [...currentUser.albums, albumId];
        }

        await currentUser.save();

        res.json(currentUser);
    } catch (error) {
        console.log(error);
        next(createError.InternalServerError());
    }
};



export const deleteUser = async (req, res, next) => {
    try {
        const { _id } = req.body;

        const currentUser = User.findById(_id);

        if (!currentUser) {
            return next(createError.NotFound());
        }

        // Try to use findByIdAndRemove()
        await User.findByIdAndRemove(_id);

        console.log(`User with _id ${_id} was removed from the "users" collection!`);

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
