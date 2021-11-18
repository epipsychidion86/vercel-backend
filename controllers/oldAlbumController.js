// ! Old code for the postAlbum controller function...

try {
    const { _id, band, title, year } = req.body;
    // Find the user trying to add an album to their collection
    // let currentUser = await User.findById(_id);
    
    let currentUser = await User.findById(_id);

    if (!currentUser) {
      // 404 = not found
      return next(createError.NotFound());
    }
    
    // Find out if there is already an album with the same details in their albums collection...
    // NOTE: the "find" method here is a JavaScript method!
    let albumFound = currentUser.albums.find(album =>
        album.band === band && album.title === title && album.year == year
    );

    // If we didn't find a matching album, add the new album to the user's "albums" array
    if (!albumFound) {
      // Create a new album object with the details of the new album
      const newAlbum = {
        title: title,
        band: band,
        year: year
      };

      // What is another way we can add the new album to the user's list of albums?
      // Using the spread operator!
      const newAlbumsArray = [...currentUser.albums, newAlbum];

      try {
        // What is another (quicker!) way we can save the updated user (with + 1 album) in the "users" collection?
        // findByIdAndUpdate!
        //                           _id of user to find
        //                             ^ Update we want to make to the user (like using $set in MongoDB)
        //                             ^               ^               Extra options
        //                             ^               ^                     ^
        await User.findByIdAndUpdate(_id, {albums: newAlbumsArray}, {runValidators: true});

        console.log("Album added!");

        const returnedUser = {
          _id: _id,
          username: currentUser.username,
          albums: newAlbumsArray
        }

        // Send the current user's updated details in the response to the frontend
        res.json(returnedUser);
      
      } catch (e) {
        // 403 = "Forbidden" / "Verboten!"
        next(createError.Forbidden());
      }
    } else {
      // Else, if there is already an album in the user's "albums" array with the same details...
      // Send back a 409 error ("Conflict") to the frontend, using the global error handling middleware!
      next(createError.Conflict());
    }
  } catch(e) {
    // 500 - "Internal Server Error"
    next(createError.InternalServerError());
  }