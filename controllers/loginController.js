// ! We are no longer using LowDB
// import { db } from "../index.js";

// Import http-errors
import createError from "http-errors";

// Import the User model from the "models" directory
import User from "../models/User.js";

// Post request controller function
export const loginPost = async (req, res, next) => {
    try {
        // Get the username from the request body
        const {username, password} = req.body;

        // See if the user trying to log in already exists in the "users" collection
        let currentUser = await User.findOne({$and: [{username: username}, {password: password}]});

        console.log("currentUser = ", currentUser);

        // If no user is found in the "users" collection with the same username AND password as the person logging in...
        if (!currentUser) {
            // See if there is a user in the collection with just the same username as the person logging in...
            let userNameValid = await User.findOne({username: username});

            // If there is a user already in the collection with the same username as the person logging in...
            // It looks like they gave the wrong password - create an error and forward it on to our error handling middleware
            if (userNameValid) {
                // Send a 401 error (Unauthorized) to the error handling middleware
                next(createError.Unauthorized());
            } else {
                // If the user trying to log in doesn't exist in the "users" collection, create a new document with their data
                // (We can get the data they sent in the POST request from the request body)
                currentUser = new User({
                    username: username,
                    password: password,
                    // "albums" will be initialized by default as an empty array
                })

                // Next, save the new document in the "users" collection
                await currentUser.save();

                console.log("New user created!");

                const returnedUser = {
                    _id: currentUser._id,
                    username: currentUser.username,
                    albums: currentUser.albums
                }

                // Send a response back to the frontend with the user's _id, username and albums only
                res.status(201).json(returnedUser);
            }
        } else {
            await currentUser.populate("albums");

            // Else, if a user with the same username/password is found...
            const returnedUser = {
                _id: currentUser._id,
                username: currentUser.username,
                albums: currentUser.albums
            }

            // Send a response back to the frontend with the user's _id, username and albums only
            res.json(returnedUser);
        }
    } catch(e) {
        // res.status(500).end();
        next(createError.InternalServerError());
    }
}
