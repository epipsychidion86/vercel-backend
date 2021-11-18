// ! We are no longer using LowDB
// import { db } from "../index.js";

// ! We are no longer using uuid
// import { v4 as uuid_v4 } from "uuid";

// Import http-errors
import createError from "http-errors";

// Import User model
import User from "../models/User.js";
// ? New: import Album model
import Album from "../models/Album.js";

// ==========================================================================================================

// * 09/11/2021:

// * We will soon change the "postAlbum" controller function to work with the new "Album" model

// ! Old process:
// USER fills in album details in the browser --> Hits button
//                                            --> Adds an object to the USER'S "albums" array with the album details

// ? New process:
// USER fills in album details in the browser --> Hits button
//                                            --> ALBUM is created in "albums" collection (unless it is already there!)
//                                            --> ALBUM gets the _id of USER (in "createdBy" array)
//                                            --> USER gets the _id of ALBUM (in "albums" array)

// ==========================================================================================================

// * 1. POST REQUEST CONTROLLER FUNCTION
// ? New version - adds an album to the "albums" collection


export const postAlbum = async (req, res, next) => {
// POST /albums
//     body: {
//         userId: "",
//         title: "",
//         band: "",
//         year: "",
//     }

// find user
// if no user, send 401 Unauthorized and end request

// find existing album
// if no album, create new album
// else get existing album

// send response with albumId and status code 201/200



//     // -------------------------
// PATCH /users/:userId
//     body: {
//       albumId: "",
//     }

// find current user
// if no user, send 404 Not Found and end request

// check if albumId is in user's albums array
// if yes: remove albumId from array [1] => []
// if no: push albumId to array [] => [1]

// send response with the updated user and status code 200
// alternative: send response with no payload and status code 204




  // try {
  //   const { _id, band, title, year } = req.body;

  //   // Find the user trying to add an album to their collection
  //   let currentUser = await User.findById(_id);

  //   // If no user is found, create a 404 ("Not Found") error and pass it on to the error handling middleware
  //   if (!currentUser) {
  //     return next(createError.NotFound());
  //   }


  //   // if no user, send 404 to client

  //   // Create a new album
  //   // ? Note: we will also need to check whether the album already exists in the "albums" collection before creating it
  //   let newAlbum = new Album({
  //     title: title,
  //     band: band,
  //     year: year,
  //     addedBy: []
  //   });

  //   // Save the new album in the "albums" collection
  //   await newAlbum.save();

  //   // Create an object to send the user's updated details to the frontend
  //   // Note: no password!
  //   const updatedUser = {
  //     _id: _id,
  //     username: currentUser.username,
  //     albums: []
  //   }

  //   // Send the current user's updated details in the response to the frontend
  //   res.json(updatedUser);
  // } catch(e) {
  //   // 500 error = "Internal Server error"
  //   next(createError.InternalServerError());
  // }
};

// ===========================================

// *2. DELETE REQUEST CONTROLLER FUNCTION - Delete one album
export const deleteAlbum = async (req, res, next) => {
  try {
    const { userId, deletedAlbumId } = req.body;

    // Find the user who is deleting an album using findById
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return next(createError.NotFound());
    }

    // Create a new array of albums, which is the same as the old array - minus the album the user is deleting
    //                                                      type = ObjectId
    //                                                            ^          type = string
    //                                                            ^               ^
    const newAlbumsArray = currentUser.albums.filter(album => album._id != deletedAlbumId);

    try {
      // Try to find the user, update their albums and save the new version of the user in the "users" collection...
      // ... using findByIdAndUpdate!
      await User.findByIdAndUpdate(userId, {albums: newAlbumsArray}, {runValidators: true});

      console.log(`Album with id ${deletedAlbumId} was deleted!`);

      const returnedUser = {
        _id: userId,
        username: currentUser.username,
        albums: newAlbumsArray
      }

      // Send the current user's updated details in the response to the frontend
      res.json(returnedUser);
    } catch(e) {
      // We could not delete the album for some reason, so send a 403 ("Forbidden") error to the frontend
      next(createError.Forbidden());
    }
  } catch(e) {
    // Send a 500 "Internal Server Error" to the error handling middleware
    next(createError.InternalServerError());
  }
};

// ===========================================

// *3. DELETE REQUEST TO "/ALL" CONTROLLER FUNCTION - Deletes all albums!
export const deleteAllAlbums = async (req, res, next) => {
  try {
    // Destructure the request body
    const { _id } = req.body;

    // Try to find the user who sent the request from the frontend
    const currentUser = await User.findById(_id);

    // If there is no user with this _id in the "users" collection...
    // Use "http-errors" to forward a 404 error ("Not Found") to the error handling middleware
    if (!currentUser) {
      return next(createError.NotFound());
    }

    // If there is a user with this _id in the "users" collection...
    // Use Mongoose's "findByIdAndUpdate" method to update their "albums" field to an EMPTY array
    await User.findByIdAndUpdate(_id, { albums: [] }, {runValidators: true});

    console.log(`User id ${_id} deleted all albums!`);

    // Create an updated user object (minus password!) to send back to the frontend
    const updatedUser = {
      _id: _id,
      username: currentUser.username,
      albums: []
    }

    // Send a response to the frontend, including the updated user details
    res.json(updatedUser);
  } catch(e) {
    // In case of an error, use "http-errors" to forward a 500 error (Internal Server Error) to the error handling middleware
    next(createError.InternalServerError());
  }
}





// ===========================================

// export const updateAlbum = async (req, res, next) => {
//     const {id, band, title, year, username} = req.body;

//     const user = await User.findOne({username: username});
//     user.albums.forEach(album => {
//         if (album.id === id) {
//             album.band = band;
//             album.title = title;
//             album.year = year;
//         }
//     })

//     await user.save();

//     res.json(user.albums);
// };
