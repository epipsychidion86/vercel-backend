import { db } from "../index.js";

// Import uuid
import { v4 as uuid_v4 } from "uuid";

// POST REQUEST CONTROLLER FUNCTION
export const getAlbumPost = async (req, res, next) => {
    const { username, band, title, year } = req.body;

    const newAlbum = {
        id: uuid_v4(),
        band: band,
        title: title,
        year: year
    }

    // * 14/10 TASK 1
    // We want to find the user object in the db which matches the logged in user who sent the new album
    // 1. Find the user in the db with the same username as whoever added the new album
    let updatedUser = db.data.users.find(user => {
        // When we find the correct user object in the db
        if (user.username === username) {

            // * 14/10 TASK 2
            // Make sure that only unique (non-duplicate) albums can be added to the user's "albums" array

            // Check if an album with the same details already exists in the user's "albums"...
            const albumExists = user.albums.find(album => {
                // If the user already has the same album in their "albums" array...
                if (album.band.toLowerCase() === band.toLowerCase()
                    && album.title.toLowerCase() === title.toLowerCase() 
                    && album.year === year
                ) {
                    return album;
                } 
            })

            // * Only if the album doesn't already exist should we add it...
            // "If the albumExists variable is undefined..."
            // Then it is ok to add the album!
            if (!albumExists) {
                // Push the new album into its "albums" array
                user.albums.push(newAlbum); 
                console.log(`New album added to the albums array with id ${newAlbum.id}`);
                // Return the user object you just updated, which becomes the value of "updatedUser"
                // You can now send the up to date list of the user's albums back to the frontend to be rendered
                // * But only after the db has written the change you just made, with db.write()!
                return user;
            } else {
                // If the user already has the same album...
                // Just return the user, don't change it!
                return user;
            }
        }
    })

    // Write our changes to the db
    await db.write();

    res.status(201).json(updatedUser.albums);
}

// ===========================================

export const getAlbumDelete = async (req, res, next) => {
    // Grab the data from the request body - (1) the username of the logged in user, (2) the id of the album to delete
    console.log("!", req.body)
    
    const { username, id } = req.body;
    
    db.data.users.find(user => {
        // Find the currently logged in user's entry in the db
        if (user.username === username) {
            // Create a new array of albums using filter() array method
            // All albums go into the new array EXCEPT the one with the same id as sent from the frontend
            const newAlbums = user.albums.filter(album => album.id !== id);
            // Update the user's list of albums to the new list (with one album deleted)
            user.albums = newAlbums;
            console.log(`Deleted album with id ${id}`);
        }
    })

    // Update the database with the new data
    await db.write();

    // Just as an example, grab the current user's entry from the database - has the album been deleted?
    const currentUser = db.data.users.find(user => user.username === username);

    // Respond by sending the new list of albums back to the frontend
    res.json(currentUser.albums);
}